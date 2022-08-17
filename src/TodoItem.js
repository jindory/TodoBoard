import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import styled from 'styled-components';

const TodoItem = ({data, fetchData, handlerDelTodo, inputFocus, handlerEditTodo, handlerEditCls}) => {
    const [defTodoText, setDefTodoText] = useState(data.content);
    const ChangeTodo = (e) => {
        setDefTodoText(e.target.value)
    }

    const handlerUpdateTodo = (e) => {
        let item = e.target.closest('li');
        let id = item.dataset.id;
        console.log(id);
        fetch(`http://localhost:3001/todos/${id}`, {
            method: 'PATCH',
            headers:{
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify({content : defTodoText})
        })
        item.classList.remove('editmode');
    }

    // 체크 변동
    const toggleTodos = (e) => {
        let item = e.target.closest('li');
        let id = item.dataset.id;
        let completed = e.target.checked;

        fetch(`http://localhost:3001/todos/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify({completed: completed})
        }).then(fetchData())
        .catch((error)=>console.log(error));
    }
    

    return(
        <li data-id={data.id}>
            <StyledLabel>
                <StyledInput className={data.completed===true ? 'checked' : null} type="checkbox" onClick={toggleTodos}/>
            </StyledLabel>
            <input className="ipt-normal" type="text" value={defTodoText} ref={inputFocus} onChange={ChangeTodo} />
            <label className="ipt-label">{defTodoText}</label>
            <div className="buttonGroup">
                <div class={`item_buttons content_buttons`}>
                    <button class="todo_edit_button def-mode" onClick={handlerEditTodo}>
                        <i><FontAwesomeIcon icon={faPenToSquare}/> </i>
                    </button>
                    <button class="todo_remove_button def-mode" onClick={handlerDelTodo}>
                        <i><FontAwesomeIcon icon={faTrashCan}/> </i>
                    </button>

                    <button class="todo_edit_confirm_button todo_edit_set" onClick={handlerUpdateTodo}>
                        <i><FontAwesomeIcon icon={faCheck} /> </i>
                    </button>
                    <button class="todo_edit_cancel_button todo_edit_set" onClick={handlerEditCls}>
                        <i><FontAwesomeIcon icon={faXmark} /> </i>
                    </button>
                </div>
            </div>
        </li>
    )
}

export default TodoItem

const StyledLabel = styled.label`
  position:absolute;
  top:50%;
  left:10px;
  display: flex;
  align-items: center;
  user-select: none;
  transform: translate(0, -50%);
`;


const StyledInput = styled.input`
  appearance: none;
  border: 1.5px solid #666;
  border-radius: 0.35rem;
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;


  &:checked, &.checked {
    border-color: transparent;
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
    background-size: 100% 100%;
    background-position: 50%;
    background-repeat: no-repeat;
    background-color: limegreen;
  }
`;
