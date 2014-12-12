package com.pisoft.asktheworld;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class QuestionController {
	
	@RequestMapping(value="/question/{id}", method=RequestMethod.GET)
	public String getQuestionp(@PathVariable("id") int questionID) {
		Question q = QuestionDB.getInstance().getQuestion(questionID);
		return q != null ? q.getQuestion():"Question is not found";
	}

	@RequestMapping(value="/question", method=RequestMethod.GET)
	public String getQuestion(@RequestParam(value="id", required = false) int questionID) {
		Question q = QuestionDB.getInstance().getQuestion(questionID);
		return q != null ? q.getQuestion():"Question is not found 1";
	}

	
	@RequestMapping(value="/questions", method=RequestMethod.GET)
	public  @ResponseBody long[] getQuestionsIDs() {
		Question[] qs = QuestionDB.getInstance().getQuestions();
		long ids[] = new long[qs.length];
		for(int i = 0; i < ids.length ; i++) {
			ids[i] = qs[i].getId();
		}
		return ids;
	}
	
	@RequestMapping(value="/newquestion", method=RequestMethod.POST)
	public @ResponseBody Question addQuestion(@RequestBody String question) {
		Question q = QuestionDB.getInstance().addQuestion(question);
		return q;
	}


}
