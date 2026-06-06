package com.artsail.approval.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PlanApprovalRabbitConfig {

    public static final String APPROVAL_REQUEST_EXCHANGE = "plan.approval.request";
    public static final String APPROVAL_RESULT_EXCHANGE = "plan.approval.result";
    public static final String APPROVAL_REQUEST_QUEUE = "plan.approval.request.queue";
    public static final String APPROVAL_RESULT_QUEUE = "plan.approval.result.queue";
    public static final String APPROVAL_REQUEST_ROUTING_KEY = "plan.approval.request";
    public static final String APPROVAL_RESULT_ROUTING_KEY = "plan.approval.result";

    @Bean
    public TopicExchange approvalRequestExchange() {
        return new TopicExchange(APPROVAL_REQUEST_EXCHANGE, true, false);
    }

    @Bean
    public Queue approvalRequestQueue() {
        return QueueBuilder.durable(APPROVAL_REQUEST_QUEUE).build();
    }

    @Bean
    public Binding approvalRequestBinding() {
        return BindingBuilder.bind(approvalRequestQueue()).to(approvalRequestExchange()).with(APPROVAL_REQUEST_ROUTING_KEY);
    }

    @Bean
    public TopicExchange approvalResultExchange() {
        return new TopicExchange(APPROVAL_RESULT_EXCHANGE, true, false);
    }

    @Bean
    public Queue approvalResultQueue() {
        return QueueBuilder.durable(APPROVAL_RESULT_QUEUE).build();
    }

    @Bean
    public Binding approvalResultBinding() {
        return BindingBuilder.bind(approvalResultQueue()).to(approvalResultExchange()).with(APPROVAL_RESULT_ROUTING_KEY);
    }
}