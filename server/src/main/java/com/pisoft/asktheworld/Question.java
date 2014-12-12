package com.pisoft.asktheworld;

import java.util.ArrayList;

public class Question {
	private final long id;
	private final String question;
	private final ArrayList<String> answers = new ArrayList<String>();
	public Question(long id, String question) {
		this.id = id;
		this.question = question;
	}
	public long getId() {
		return id;
	}
	public String getQuestion() {
		return question;
	}
	public ArrayList<String> getAnswers() {
		return answers;
	}
	
	public void addAnswer(String answer) {
		answers.add(answer);
	}
}
