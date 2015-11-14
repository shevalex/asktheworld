package com.pisoft.asktheworld.service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service("mail")
public class MailSender extends JavaMailSenderImpl {

	StringBuffer recoveryPassword = new StringBuffer("Please follow the link to recover password");

	public MailSender() {
		super();
		this.setHost("smtp.gmail.com");
		this.setPort(25);
		this.setUsername("tryasktheworld");
		this.setPassword("asdasdtryasktheworld123");
		Properties jmp = new Properties();
		jmp.setProperty("mail.transport.protocol", "smtp");
		jmp.setProperty("mail.smtp.auth", "true");
		jmp.setProperty("mail.smtp.starttls.enable", "true");
		this.setJavaMailProperties(jmp);
	}

	public void sendMail(String to, String subject, String body)
    {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        this.send(message);
    }
	
	public void sendRecoveryPassword(String to, String server, String token) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(to);
		message.setSubject("Ask The World password rescovery");
		message.setText("Please click this link to recover your password:\n" 
		+server+"/main.html#[page-RestorePasswordPage]:[recoveryToken-"+token+"]  \n" +
		"If you didn't request it, please ignore this email");
		this.send(message);
	}

	public static void main(String[] args) {
		//MailSender ms = new MailSender();
		//ms.sendMail("anton.avtamonov@gmail.com", "Test me", "This is body!!!");
		//ms.sendRecoveryPassword("anton.avtamonov@gmail.com", "XYI", "asdsdfhaksjhdfkjasfiuey98324929342h3hf");
		String pass = "{\"password\":\"pppppp\"}";
		ObjectMapper om = new ObjectMapper();
		try {
			Map<String,String> map = om.readValue(pass, HashMap.class);
			System.out.println(map.get("password"));
		} catch (JsonParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JsonMappingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		


	}
}


