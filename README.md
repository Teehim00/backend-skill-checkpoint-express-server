# Q&A API

A RESTful API built with Express and PostgreSQL for managing questions, answers, and voting.

## Features
- **Questions**: Create, view, search, delete.
- **Answers**: Add answers to questions, view all answers for a question, delete all answers when deleting a question.
- **Voting**: Upvote or downvote questions and answers.

## API Endpoints

### Questions
- **POST /questions**  
  Create a question.
  - Example Request:
    ```bash
    curl -X POST http://localhost:4000/questions -H "Content-Type: application/json" -d '{"title": "Sample Question", "description": "Description of the question", "category": "General"}'
    ```
- **GET /questions**  
  View all questions.
  - Example Request:
    ```bash
    curl http://localhost:4000/questions
    ```
- **GET /questions/:questionId**  
  View a specific question.
  - Example Request:
    ```bash
    curl http://localhost:4000/questions/1
    ```
- **POST /questions/search?title=&category=**  
  Search questions by title or category.
  - Example Request:
    ```bash
    curl http://localhost:4000/questions/search?title=Sample&category=General
    ```
- **DELETE /questions/:questionId/answers**  
  Delete a question and its answers.
  - Example Request:
    ```bash
    curl -X DELETE http://localhost:4000/questions/1/answers
    ```
- **POST /questions/:questionId/vote**  
  Vote on a question.
  - Example Request:
    ```bash
    curl -X POST http://localhost:4000/questions/1/vote -d '{"vote": "up"}'
    ```

### Answers
- **POST /questions/:questionId/answers**  
  Add an answer to a question.
  - Example Request:
    ```bash
    curl -X POST http://localhost:4000/questions/1/answers -H "Content-Type: application/json" -d '{"answer": "Sample Answer"}'
    ```
- **GET /questions/:questionId/answers**  
  View all answers for a question.
  - Example Request:
    ```bash
    curl http://localhost:4000/questions/1/answers
    ```
- **POST /answers/:answerId/vote**  
  Vote on an answer.
  - Example Request:
    ```bash
    curl -X POST http://localhost:4000/answers/1/vote -d '{"vote": "down"}'
    ```

## Environment Variables

Set up the following environment variables for the application to run properly:

- `PORT`: Port number to run the server (default: 4000)
- `DB_HOST`: Hostname for PostgreSQL database
- `DB_USER`: PostgreSQL database user
- `DB_PASSWORD`: PostgreSQL database password
- `DB_NAME`: PostgreSQL database name
- `DB_PORT`: PostgreSQL database port (default: 5432)
