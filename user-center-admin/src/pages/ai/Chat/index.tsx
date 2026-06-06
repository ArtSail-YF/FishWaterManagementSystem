import {
  AlertOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  DeleteOutlined,
  ExperimentOutlined,
  InboxOutlined,
  MessageOutlined,
  PlusOutlined,
  RobotOutlined,
  SearchOutlined,
  SendOutlined,
  ShopOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import {
  Alert,
  Avatar,
  Button,
  Empty,
  Input,
  List,
  Popconfirm,
  Space,
  Spin,
  Tag,
  Typography,
  message,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import './index.css';
import {
  createChatSession,
  deleteChatSession,
  listChatMessages,
  listChatSessions,
  sendChatMessage,
  type AiChatMessage,
  type AiChatSession,
} from '@/services/api/ai';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

const unwrap = <T,>(response: any): T => response?.data?.data ?? response?.data ?? response;

const clearDarkReaderBackground = (root: HTMLElement | null) => {
  if (!root) return;
  const elements = [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))];
  elements.forEach((element) => {
    element.style.removeProperty('--darkreader-inline-bgcolor');
    element.removeAttribute('data-darkreader-inline-bgcolor');
  });
};

interface SlashCommand {
  key: string;
  command: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const slashCommands: SlashCommand[] = [
  {
    key: 'pond',
    command: '/塘口',
    title: '查询塘口',
    description: '查看塘口、养殖品种、状态和预计产量',
    icon: <AppstoreOutlined />,
  },
  {
    key: 'plan',
    command: '/计划',
    title: '查询生产计划',
    description: '查看投喂、用药、收获等计划',
    icon: <CalendarOutlined />,
  },
  {
    key: 'task',
    command: '/任务',
    title: '查询生产任务',
    description: '查看今天的任务、状态和执行人',
    icon: <ThunderboltOutlined />,
  },
  {
    key: 'feeding',
    command: '/投喂',
    title: '查询投喂记录',
    description: '查看饲料、投喂量、时间和核验状态',
    icon: <ShopOutlined />,
  },
  {
    key: 'medication',
    command: '/用药',
    title: '查询用药记录',
    description: '查看药品、剂量、休药期和核验状态',
    icon: <ExperimentOutlined />,
  },
  {
    key: 'harvest',
    command: '/收获',
    title: '查询收获记录',
    description: '查看品种、重量、时间和状态',
    icon: <InboxOutlined />,
  },
  {
    key: 'input',
    command: '/投入品',
    title: '查询投入品使用',
    description: '查看物资使用数量、成本和时间',
    icon: <SearchOutlined />,
  },
  {
    key: 'water',
    command: '/水质',
    title: '查询实时水质',
    description: '查看各塘口溶氧、水温和 pH',
    icon: <ExperimentOutlined />,
  },
  {
    key: 'trend',
    command: '/趋势',
    title: '查询水质趋势',
    description: '查看指定塘口最近 24 小时水质变化',
    icon: <ThunderboltOutlined />,
  },
  {
    key: 'alert',
    command: '/告警',
    title: '查询 IoT 告警',
    description: '查看最近未处理告警和告警统计',
    icon: <AlertOutlined />,
  },
];

const ChatPage: React.FC = () => {
  const [sessions, setSessions] = useState<AiChatSession[]>([]);
  const [activeId, setActiveId] = useState<number>();
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [commandIndex, setCommandIndex] = useState(0);
  const [hoveredCommandIndex, setHoveredCommandIndex] = useState<number | null>(null);
  const [selectedCommand, setSelectedCommand] = useState<SlashCommand>();
  const messageViewportRef = useRef<HTMLDivElement>(null);
  const commandItemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const inputRef = useRef<any>(null);

  const commandQuery = input.startsWith('/') ? input.slice(1).trim().toLowerCase() : '';
  const commandMenuOpen = input.startsWith('/') && !input.includes('\n');
  const filteredCommands = commandMenuOpen
    ? slashCommands.filter((item) =>
        `${item.command} ${item.title} ${item.description}`.toLowerCase().includes(commandQuery),
      )
    : [];
  const highlightedCommandIndex = hoveredCommandIndex ?? commandIndex;

  const loadSessions = async () => {
    const response = await listChatSessions();
    const data = unwrap<AiChatSession[]>(response) || [];
    setSessions(data);
    return data;
  };

  const loadMessages = async (sessionId: number) => {
    setLoading(true);
    try {
      const response = await listChatMessages(sessionId);
      setMessages(unwrap<AiChatMessage[]>(response) || []);
    } finally {
      setLoading(false);
    }
  };

  const handleNewSession = async () => {
    const response = await createChatSession();
    const session = unwrap<AiChatSession>(response);
    setSessions((items) => [session, ...items]);
    setActiveId(session.id);
    setMessages([]);
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await loadSessions();
        if (data.length) {
          setActiveId(data[0].id);
          await loadMessages(data[0].id);
        }
      } catch {
        message.error('加载 AI 会话失败');
      } finally {
        setInitializing(false);
      }
    })();
  }, []);

  useEffect(() => {
    const viewport = messageViewportRef.current;
    if (viewport) {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, loading]);

  useEffect(() => {
    setCommandIndex(0);
    setHoveredCommandIndex(null);
  }, [commandQuery]);

  useEffect(() => {
    if (!commandMenuOpen || commandIndex < 0 || hoveredCommandIndex !== null) return;
    commandItemRefs.current[commandIndex]?.scrollIntoView({
      block: 'nearest',
      behavior: 'auto',
    });
  }, [commandIndex, commandMenuOpen, hoveredCommandIndex]);

  useEffect(() => {
    commandItemRefs.current.forEach(clearDarkReaderBackground);
  }, [highlightedCommandIndex, commandMenuOpen]);

  const handleSelect = async (sessionId: number) => {
    setActiveId(sessionId);
    await loadMessages(sessionId);
  };

  const handleSend = async () => {
    const content = input.trim();
    if (!content || loading) return;
    let sessionId = activeId;
    if (!sessionId) {
      const response = await createChatSession();
      const session = unwrap<AiChatSession>(response);
      sessionId = session.id;
      setActiveId(sessionId);
      setSessions((items) => [session, ...items]);
    }

    const optimistic: AiChatMessage = {
      id: Date.now(),
      role: 'USER',
      content,
      sources: [],
      tools: [],
      riskLevel: 'NONE',
      createTime: new Date().toISOString(),
    };
    setMessages((items) => [...items, optimistic]);
    setInput('');
    setLoading(true);
    try {
      const response = await sendChatMessage(sessionId, content, selectedCommand?.key);
      const reply = unwrap<any>(response);
      setMessages((items) => [
        ...items,
        {
          id: Date.now() + 1,
          role: 'ASSISTANT',
          content: reply.answer,
          sources: reply.sources || [],
          tools: reply.tools || [],
          riskLevel: reply.riskLevel,
          riskNotice: reply.riskNotice,
          createTime: new Date().toISOString(),
        },
      ]);
      setSelectedCommand(undefined);
      await loadSessions();
    } catch (error: any) {
      message.error(error?.message || 'DeepSeek 回答失败，请检查 API Key');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sessionId: number) => {
    await deleteChatSession(sessionId);
    const remaining = sessions.filter((item) => item.id !== sessionId);
    setSessions(remaining);
    if (activeId === sessionId) {
      setActiveId(remaining[0]?.id);
      if (remaining[0]) await loadMessages(remaining[0].id);
      else setMessages([]);
    }
  };

  const selectCommand = (command: SlashCommand) => {
    setSelectedCommand(command);
    setInput('');
    setCommandIndex(-1);
    setHoveredCommandIndex(null);
    requestAnimationFrame(() => inputRef.current?.focus?.());
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (commandMenuOpen && filteredCommands.length) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setHoveredCommandIndex(null);
        setCommandIndex((current) =>
          current < 0 ? 0 : Math.min(current + 1, filteredCommands.length - 1),
        );
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setHoveredCommandIndex(null);
        setCommandIndex((current) =>
          current < 0 ? filteredCommands.length - 1 : Math.max(current - 1, 0),
        );
        return;
      }
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        selectCommand(filteredCommands[highlightedCommandIndex] || filteredCommands[0]);
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        setHoveredCommandIndex(null);
        setInput('');
        return;
      }
    }
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <PageContainer title={false} style={{ height: 'calc(100dvh - 96px)', overflow: 'hidden' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '280px minmax(0, 1fr)',
          gap: 16,
          height: 'calc(100dvh - 144px)',
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            background: '#fff',
            borderRadius: 8,
            padding: 12,
            overflow: 'hidden',
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Button type="primary" block icon={<PlusOutlined />} onClick={handleNewSession}>
            新建对话
          </Button>
          <List
            style={{ marginTop: 12, flex: 1, minHeight: 0, overflowY: 'auto' }}
            dataSource={sessions}
            locale={{ emptyText: '暂无历史会话' }}
            renderItem={(item) => (
              <List.Item
                onClick={() => handleSelect(item.id)}
                style={{
                  cursor: 'pointer',
                  padding: 12,
                  borderRadius: 6,
                  background: activeId === item.id ? '#e6f4ff' : 'transparent',
                }}
                actions={[
                  <Popconfirm key="delete" title="删除该会话？" onConfirm={() => handleDelete(item.id)}>
                    <DeleteOutlined onClick={(event) => event.stopPropagation()} />
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  avatar={<MessageOutlined />}
                  title={<Text ellipsis style={{ maxWidth: 170 }}>{item.title}</Text>}
                  description={`${item.messageCount || 0} 条消息`}
                />
              </List.Item>
            )}
          />
        </div>

        <div
          style={{
            background: '#fff',
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
            <Space>
              <Avatar style={{ background: '#1677ff' }} icon={<RobotOutlined />} />
              <div>
                <Text strong>水产养殖智能助手</Text>
                <br />
                <Text type="secondary">DeepSeek · LangChain4j · 本地知识检索</Text>
              </div>
            </Space>
          </div>

          <div
            ref={messageViewportRef}
            style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', padding: 20 }}
          >
            {initializing ? (
              <div style={{ textAlign: 'center', marginTop: 100 }}><Spin /></div>
            ) : messages.length === 0 ? (
              <Empty
                style={{ marginTop: 80 }}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="可以询问养殖技术、病害常识、政策法规或系统操作"
              />
            ) : (
              messages.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: item.role === 'USER' ? 'flex-end' : 'flex-start', marginBottom: 18 }}>
                  <div style={{ display: 'flex', gap: 10, maxWidth: '78%', flexDirection: item.role === 'USER' ? 'row-reverse' : 'row' }}>
                    <Avatar icon={item.role === 'USER' ? <UserOutlined /> : <RobotOutlined />} style={{ background: item.role === 'USER' ? '#52c41a' : '#1677ff' }} />
                    <div>
                      <div style={{ padding: '12px 16px', borderRadius: 10, background: item.role === 'USER' ? '#e6f4ff' : '#f5f5f5', whiteSpace: 'pre-wrap' }}>
                        {item.content}
                      </div>
                      {!!item.sources?.length && (
                        <div style={{ marginTop: 8 }}>
                          <Text type="secondary">参考资料：</Text>
                          {item.sources.map((source) => <Tag key={`${source.documentId}-${source.title}`}>{source.title}</Tag>)}
                        </div>
                      )}
                      {!!item.tools?.length && (
                        <div style={{ marginTop: 8 }}>
                          <Text type="secondary">已查询实时数据：</Text>
                          {item.tools.map((tool) => (
                            <Tag color="blue" key={tool.name} title={tool.description}>{tool.label}</Tag>
                          ))}
                        </div>
                      )}
                      {item.riskNotice && <Alert style={{ marginTop: 8 }} type="warning" showIcon message={item.riskNotice} />}
                    </div>
                  </div>
                </div>
              ))
            )}
            {loading && <div style={{ padding: 12 }}><Spin size="small" /> <Text type="secondary">正在思考...</Text></div>}
          </div>

          <div
            style={{
              padding: 16,
              borderTop: '1px solid #f0f0f0',
              flexShrink: 0,
              position: 'relative',
            }}
          >
            {commandMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  left: 16,
                  right: 16,
                  bottom: 'calc(100% - 8px)',
                  zIndex: 20,
                  maxHeight: 360,
                  overflowY: 'auto',
                  padding: 8,
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 10,
                  boxShadow: '0 10px 32px rgba(0, 0, 0, 0.16)',
                }}
                onMouseLeave={() => setHoveredCommandIndex(null)}
              >
                <div style={{ padding: '6px 10px 8px' }}>
                  <Text type="secondary">查询功能</Text>
                  <Text type="secondary" style={{ float: 'right', fontSize: 12 }}>
                    ↑↓ 选择 · Enter 确认 · Esc 关闭
                  </Text>
                </div>
                {filteredCommands.length ? (
                  filteredCommands.map((item, index) => (
                    <div
                      key={item.key}
                      ref={(element) => {
                        commandItemRefs.current[index] = element;
                        clearDarkReaderBackground(element);
                      }}
                      className={index === highlightedCommandIndex ? 'ai-command-item-active' : 'ai-command-item'}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        selectCommand(item);
                      }}
                      onMouseEnter={() => setHoveredCommandIndex(index)}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '32px 92px minmax(0, 1fr)',
                        alignItems: 'center',
                        gap: 8,
                        padding: '9px 10px',
                        cursor: 'pointer',
                        borderRadius: 7,
                      }}
                    >
                      <Avatar
                        size={28}
                        icon={item.icon}
                        className={
                          index === highlightedCommandIndex
                            ? 'ai-command-icon-active'
                            : 'ai-command-icon'
                        }
                        style={{
                          background: undefined,
                        }}
                      />
                      <Text strong>{item.command}</Text>
                      <div style={{ minWidth: 0 }}>
                        <Text>{item.title}</Text>
                        <br />
                        <Text type="secondary" ellipsis style={{ display: 'block', fontSize: 12 }}>
                          {item.description}
                        </Text>
                      </div>
                    </div>
                  ))
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="没有匹配的查询功能"
                    style={{ margin: '16px 0' }}
                  />
                )}
              </div>
            )}
            <Space.Compact style={{ width: '100%', alignItems: 'stretch' }}>
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px 0 0 6px',
                  padding: selectedCommand ? '8px 11px 4px' : 0,
                  transition: 'border-color 0.2s',
                }}
              >
                {selectedCommand && (
                  <Tag
                    color="blue"
                    icon={selectedCommand.icon}
                    closable
                    onClose={(event) => {
                      event.preventDefault();
                      setSelectedCommand(undefined);
                      requestAnimationFrame(() => inputRef.current?.focus?.());
                    }}
                    style={{ marginBottom: 4 }}
                  >
                    {selectedCommand.title}
                  </Tag>
                )}
                <TextArea
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleInputKeyDown}
                  autoSize={{ minRows: selectedCommand ? 1 : 2, maxRows: 5 }}
                  maxLength={4000}
                  bordered={!selectedCommand}
                  style={selectedCommand ? { padding: '4px 0', boxShadow: 'none', resize: 'none' } : undefined}
                  placeholder={selectedCommand ? '输入查询条件，例如：3号塘、今天' : '输入问题，输入 / 选择查询功能'}
                />
              </div>
              <Button type="primary" icon={<SendOutlined />} loading={loading} onClick={handleSend} style={{ height: 'auto' }}>
                发送
              </Button>
            </Space.Compact>
            <Paragraph type="secondary" style={{ margin: '8px 0 0', fontSize: 12 }}>
              输入 <Text keyboard>/</Text> 可选择业务查询功能。AI 回答可能存在误差，病害诊断和用药建议必须由专业人员复核。
            </Paragraph>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ChatPage;
