package com.pisoft.asktheworld;

import java.util.ArrayList;

public class QuestionDB {
	private static QuestionDB db = new QuestionDB();
	private ArrayList<Question> questions = new ArrayList<Question>();
	private long lastID = 0;
	private QuestionDB(){
		
	}
	public static QuestionDB getInstance() { return db;}
	
	public Question getQuestion(int id) {
		for(Question q: questions) {
			if (q.getId() == id) {
				return q;
			}
		}
		return null;
	}
	
	public void addQuestion(Question q){
		questions.add(q);
	}
	
	public Question addQuestion(String question) {
		Question q = new Question(lastID++, question);
		addQuestion(q);
		return q;
	}
	
	public void deleteQuestion(int id) {
		questions.remove(getQuestion(id));
	}
	
	public Question[] getQuestions() {
		return questions.toArray(new Question[questions.size()]);
	}
	
	
	
}
