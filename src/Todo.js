import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import TodoItem from "./TodoItem";


const Todo = () => {
    const [todos, setTodos] = useState([]);
    const [infoText, setInfoText] = useState();
    const [inputTodo, setInputTodo] = useState('');
    const [todoQ, setTodoQ] = useState(0);
    const iptRef = useRef([]);

    async function fetchData() {
        const respons = await fetch("http://localhost:3001/todos");
        const result = await respons.json();
        setTodos(result);
    }

    useEffect(() => {
        fetchData();
    },[]); 

    useEffect(() => {
        const test = todos.filter((el)=>{return el.completed === false});
        setTodoQ(test.length)
    })

    const handleChange = (e) => {
        setInputTodo(e.target.value.toUpperCase());
    };

    // 추가
    const handlerAddTodo = (e) => {
        if(e.target.value === '' || e.target.value === ' '){
            return setInfoText('할일을 입력해주세요')
        } 
        e.preventDefault()
        const cont = {
            content:inputTodo,
            completed: false,
        }
        fetch('http://localhost:3001/todos', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify(cont),
        })
        .then(fetchData())
        .then(setInputTodo(''))
        .then(setInfoText(''))
        .catch((error)=>console.log(error))
    }

    const handleKeyPress = (e) => {
        if (e.code === 'Enter') {
            handlerAddTodo(e);
        }
      };

    // 삭제
    const handlerDelTodo = (e) => {
        let item = e.target.closest('li');
        let id = item.dataset.id;
        e.preventDefault()
        fetch(`http://localhost:3001/todos/${id}`,{
            method : 'DELETE'
        }).then(fetchData())
    }

    //수정
    const handlerEditTodo = (idx) => (e) => {
        let itemCon = e.target.closest('li');
        itemCon.classList.add('editmode');
        console.log(iptRef.current)
        iptRef.current[idx] && iptRef.current[idx].focus();
    }

    //수정 종료
    const handlerEditCls = (e) => {
        let itemCon = e.target.closest('li');
        itemCon.classList.remove('editmode');
    }


    return(
        <div className="container">
            <div className="w-base">
                <div className="t-add">   
                    <h2>2022년 8월 17일 <small>{todoQ}개의 할일</small></h2>
                    <div>
                        <input 
                        id="input-destination"
                        type="text"
                        value={inputTodo}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        placeholder="할일을 입력 후 Enter"/>
                        <button className="btn-add" type="button"><FontAwesomeIcon icon={faPlus} /></button>
                    </div>
                </div>
                <p>{infoText}</p>
                <div className="t-body">
                    <ul className="t-lst">
                        {todos && todos.map((el, idx)=> {
                            return(<TodoItem 
                                idx={idx}
                                key={el.id} 
                                data={el} 
                                todos={todos}
                                fetchData={fetchData}
                                iptRef={iptRef}
                                handlerDelTodo={handlerDelTodo} 
                                handlerEditTodo={handlerEditTodo}
                                handlerEditCls={handlerEditCls}
                            />)
                        })}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Todo