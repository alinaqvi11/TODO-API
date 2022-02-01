import todoEntity from "../../../domain/entities/todoEntity";
import {statusCode,message} from '../../services/utils/messages'
import { v4 as uuidv4 } from 'uuid';
import TodoRepository from "../../../infrastructure/repositories/todo/todoRespository";
import MyAppError from "../../../http/errors/myAppError";


class TodoServices  {
  
  static getTodos = async (req:any) => {
    try {
      const size = parseInt(req.query.size);
      const page =parseInt (req.query.page);
      const todos = await TodoRepository.getTodos(size ,page);
      const todo = todos.map((value: any) => {
        return todoEntity.createFromObject(value);      
      });
      return {statusCode : statusCode.SUCCESS,data : todo};
    
    } catch (err) {
      console.log(err);    
      return new MyAppError(statusCode.SERVER_ERROR,message.SERVER_ERROR);   
    }
  };
  static getTodoById = async (req:any) => {
    try {
      const id:string = req.params.id;
      const todo = await TodoRepository.getTodoById(id);
      if (!todo) {
        return new MyAppError(statusCode.NOT_FOUND,message.NOT_FOUND);
      } else return {statusCode:statusCode.SUCCESS,data : todoEntity.createFromObject(todo)};
    } catch (err) {
      console.log(err);
      return new MyAppError(statusCode.SERVER_ERROR,message.SERVER_ERROR); 
    }
  };
  static addTodo = async (req:any) => {
    try {  
      const body = req.body; 
      const todoId = uuidv4();  
      const dtoTodo = todoEntity.createFromInput(todoId,body);
      const daoTodo = await TodoRepository.addTodo(dtoTodo)
      return {statusCode:statusCode.CREATED,message : message.SUCCESS[0]};
      }
     catch (err) {
      console.log(err);
      return new MyAppError(statusCode.SERVER_ERROR,message.SERVER_ERROR); 
    }
  };
  static updateTodo = async (req:any) => {
    try {    
      const body = req.body;
      const todoId = req.params.id;
      const dtoTodo = todoEntity.createFromInput(todoId,body);   
      const daoTodo = await TodoRepository.updateTodo(dtoTodo);         
      if (!daoTodo) {
        return new MyAppError(statusCode.NOT_FOUND,message.NOT_FOUND);
      } else return {statusCode : statusCode.SUCCESS,message :message.SUCCESS[2]}; 
    } catch (err) {
      console.log(err);
      return new MyAppError(statusCode.SERVER_ERROR,message.SERVER_ERROR); 
    }
  };
  static deleteTodo = async (req: any) => {
    try {
      const todo = await TodoRepository.deleteTodo(req.params.id,req.body.userId)
      if (!todo) {
        return new MyAppError(statusCode.NOT_FOUND,message.NOT_FOUND);
      } else return {statusCode : statusCode.SUCCESS,message : message.SUCCESS[1]};
    } catch (err) {
      console.log(err);
      return new MyAppError(statusCode.SERVER_ERROR,message.SERVER_ERROR); 
    }
  };
}

export default TodoServices;
