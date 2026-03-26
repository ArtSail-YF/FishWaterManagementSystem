package com.artsail.admin;

import com.artsail.admin.model.domain.User;
import com.artsail.admin.service.UserService;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@Slf4j
@SpringBootTest
public class AdminApplicationTests {

	@Autowired
	private UserService userservice;


	@Test
	public void testAddUser(){

		User user=User.builder()
				.userName("ArtSail")
				.gender(0)
				.phone("13559272451")
				.email("1337284817@qq.com")
				.userPassword("123456")
				.avatarUrl("https://tse1-mm.cn.bing.net/th/id/OIP-C.nK0XeOYsRtt_DesX3QgcsgHaHa?w=154&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3")
				.build();
		boolean result =userservice.save(user);
		log.info(String.valueOf(user.getId()));
		Assertions.assertTrue(result);
	}


	@Test
	void userRegister() {



		long result2=userservice.userRegister("ArtS","123456","123456");
		Assertions.assertEquals(-1,result2);

		long result3=userservice.userRegister("ArtSail","123","123456");
		Assertions.assertEquals(-1,result3);

		// 使用时间戳生成唯一用户名，避免重复
		String uniqueUsername = "TestUser" + System.currentTimeMillis();
		long result4=userservice.userRegister(uniqueUsername,"123456","123456");
		log.info("注册结果：{}, 用户名：{}, 返回 ID: {}", result4 > 0, uniqueUsername, result4);
		Assertions.assertTrue(result4 > 0);
	}


}
