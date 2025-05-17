// 날짜, 기분, 메모, 할일 데이터 저장용
let selectedDate = new Date();
let moods = JSON.parse(localStorage.getItem('moods') || '{}');
let memos = JSON.parse(localStorage.getItem('memos') || '{}');
let todos = JSON.parse(localStorage.getItem('todos') || '{}');

// 추가: 카테고리별 할일 저장 객체
let categoryTodos = JSON.parse(localStorage.getItem('categoryTodos') || '{}');
if (Object.keys(categoryTodos).length === 0) {
    categoryTodos = {
        work: [],
        personal: [],
        study: [],
        shopping: []
    };
}

function formatDate(date) {
    return date.toISOString().slice(0, 10);
}

function renderCalendar() {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    document.getElementById('monthYear').textContent = `${year}년 ${month + 1}월`;

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    let html = '';
    let day = 1 - firstDay;
    for (let i = 0; i < 6; i++) {
        html += '<tr>';
        for (let j = 0; j < 7; j++, day++) {
            if (day < 1 || day > lastDate) {
                html += '<td></td>';
            } else {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                let classes = [];
                if (formatDate(selectedDate) === dateStr) classes.push('selected');
                if (moods[dateStr]) classes.push('has-mood');
                html += `<td class="${classes.join(' ')}" data-date="${dateStr}">${day}`;
                if (moods[dateStr]) {
                    html += `<span class="mood-icon">${getMoodIcon(moods[dateStr])}</span>`;
                }
                html += `</td>`;
            }
        }
        html += '</tr>';
    }
    document.getElementById('calendarBody').innerHTML = html;

    // 날짜 클릭 이벤트
    document.querySelectorAll('.calendar td[data-date]').forEach(td => {
        td.onclick = () => {
            selectedDate = new Date(td.dataset.date);
            renderCalendar();
            renderMood();
            renderMemo();
            renderTodos();
        };
    });
}

function getMoodIcon(mood) {
    switch (mood) {
        case 'happy': return '😊';
        case 'sad': return '😢';
        case 'angry': return '😠';
        case 'neutral': return '😐';
        case 'tired': return '🥱';
        case 'smile': return '😁';
        default: return '';
    }
}

function renderMood() {
    const dateStr = formatDate(selectedDate);
    document.querySelectorAll('.mood-select span').forEach(span => {
        span.classList.toggle('selected', moods[dateStr] === span.dataset.mood);
        span.onclick = () => {
            if (moods[dateStr] === span.dataset.mood) {
                delete moods[dateStr];
            } else {
                moods[dateStr] = span.dataset.mood;
            }
            localStorage.setItem('moods', JSON.stringify(moods));
            renderCalendar();
            renderMood();
        };
    });
}

function renderMemo() {
    const dateStr = formatDate(selectedDate);
    document.getElementById('memo').value = memos[dateStr] || '';
}

function renderTodos() {
    const dateStr = formatDate(selectedDate);
    const list = todos[dateStr] || [];
    const ul = document.getElementById('todoList');
    const activeCategory = document.querySelector('.tab.active').dataset.category;

    ul.innerHTML = '';
    list.forEach((item, idx) => {
        // 전체가 아닐 때만 카테고리 필터링
        if (activeCategory && activeCategory !== 'all' && activeCategory !== '' && item.category !== activeCategory) return;

        const li = document.createElement('li');
        if (item.done) li.classList.add('completed');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = item.done;
        checkbox.onchange = () => {
            item.done = checkbox.checked;
            localStorage.setItem('todos', JSON.stringify(todos));
            renderTodos();
        };

        const span = document.createElement('span');
        span.textContent = item.text;

        // 카테고리 표시
        if (item.category) {
            const categorySpan = document.createElement('span');
            let categoryText = '';
            switch (item.category) {
                case 'work': categoryText = ' 🏫'; break;
                case 'personal': categoryText = ' 🙎‍♀️'; break;
                case 'exercise': categoryText = ' 🏊'; break;
                case 'shopping': categoryText = ' 🛒'; break;
            }
            categorySpan.textContent = categoryText;
            categorySpan.style.fontSize = '0.9em';
            span.appendChild(categorySpan);
        }

        const editBtn = document.createElement('button');
        editBtn.textContent = '✏️';
        editBtn.onclick = () => {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = item.text;
            input.style.flex = '1';

            const handleClickOutside = (e) => {
                if (!input.contains(e.target)) {
                    item.text = input.value;
                    localStorage.setItem('todos', JSON.stringify(todos));
                    renderTodos();
                    document.removeEventListener('click', handleClickOutside);
                }
            };

            input.onkeydown = (e) => {
                if (e.key === 'Enter') {
                    item.text = input.value;
                    localStorage.setItem('todos', JSON.stringify(todos));
                    renderTodos();
                    document.removeEventListener('click', handleClickOutside);
                }
            };

            li.replaceChild(input, span);
            input.focus();

            setTimeout(() => {
                document.addEventListener('click', handleClickOutside);
            }, 0);
        };

        const delBtn = document.createElement('button');
        delBtn.textContent = '🗑️';
        delBtn.onclick = () => {
            list.splice(idx, 1);
            todos[dateStr] = list;
            localStorage.setItem('todos', JSON.stringify(todos));
            renderTodos();
        };

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(delBtn);
        ul.appendChild(li);
    });
}

document.getElementById('prevMonth').onclick = () => {
    selectedDate.setMonth(selectedDate.getMonth() - 1);
    renderCalendar();
    renderMood();
    renderMemo();
    renderTodos();
};
document.getElementById('nextMonth').onclick = () => {
    selectedDate.setMonth(selectedDate.getMonth() + 1);
    renderCalendar();
    renderMood();
    renderMemo();
    renderTodos();
};
document.getElementById('saveMemo').onclick = () => {
    const dateStr = formatDate(selectedDate);
    memos[dateStr] = document.getElementById('memo').value;
    localStorage.setItem('memos', JSON.stringify(memos));
    alert('메모가 저장되었습니다!');
};
document.getElementById('addTodo').onclick = () => {
    const dateStr = formatDate(selectedDate);
    const input = document.getElementById('todoInput');
    const category = document.getElementById('categorySelect').value;
    const selectedCategory = document.getElementById('categorySelect').options[document.getElementById('categorySelect').selectedIndex].textContent;

    if (!input.value.trim()) return;

    // 기본 할 일 목록 추가
    if (!todos[dateStr]) todos[dateStr] = [];
    todos[dateStr].push({
        text: `${input.value} (${selectedCategory})`,
        done: false,
        category: category
    });

    // 카테고리별 할 일 관리
    if (!categoryTodos[category]) {
        categoryTodos[category] = [];
    }
    if (category) {
        categoryTodos[category].push(input.value);
    }

    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('categoryTodos', JSON.stringify(categoryTodos));

    input.value = '';
    renderTodos();
    renderCategoryTodo();
};

// 탭 클릭 이벤트
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelector('.tab.active').classList.remove('active');
        tab.classList.add('active');

        const category = tab.dataset.category;
        document.getElementById('categorySelect').value = category;

        renderTodos();
    });
});

// 카테고리 선택 변경 이벤트
document.getElementById('categorySelect').addEventListener('change', function () {
    const selectedCategory = this.value;
    const todoInput = document.getElementById('todoInput');
    const newCategoryDiv = document.getElementById('newCategoryDiv');

    if (selectedCategory === 'new') {
        newCategoryDiv.style.display = 'block';
        todoInput.style.display = 'none';
    } else {
        newCategoryDiv.style.display = 'none';
        todoInput.style.display = selectedCategory ? 'block' : 'none';
    }
});

// 새 카테고리 추가 버튼 클릭 이벤트
document.getElementById('addNewCategoryButton').addEventListener('click', function () {
    const newCategoryName = document.getElementById('newCategoryInput').value.trim();

    if (!newCategoryName) return alert('카테고리 이름을 입력하세요!');
    if (categoryTodos[newCategoryName]) return alert('이미 존재하는 카테고리입니다.');

    categoryTodos[newCategoryName] = [];
    localStorage.setItem('categoryTodos', JSON.stringify(categoryTodos));

    const categorySelect = document.getElementById('categorySelect');
    const newOption = document.createElement('option');
    newOption.value = newCategoryName;
    newOption.textContent = newCategoryName;
    categorySelect.appendChild(newOption);

    categorySelect.value = newCategoryName;

    document.getElementById('newCategoryInput').value = '';
    document.getElementById('newCategoryDiv').style.display = 'none';
    document.getElementById('todoInput').style.display = 'block';

    renderCategoryTodo();
});

function renderCategoryTodo() {
    const container = document.getElementById('categoryTodoContainer');
    if (!container) return; // 만약 해당 엘리먼트가 없으면 종료
    container.innerHTML = '';

    Object.keys(categoryTodos).forEach(category => {
        const categoryTodoDiv = document.createElement('div');
        categoryTodoDiv.classList.add('category-todo');

        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = `${category} 할일`;
        categoryTodoDiv.appendChild(categoryTitle);

        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.placeholder = '할 일을 입력하세요';
        categoryTodoDiv.appendChild(inputField);

        const addButton = document.createElement('button');
        addButton.textContent = '할일 추가';
        addButton.onclick = () => {
            addTodoToCategory(category, inputField.value);
            inputField.value = '';
            renderCategoryTodo();
            renderTodos();
        };
        categoryTodoDiv.appendChild(addButton);

        const todoList = document.createElement('ul');
        categoryTodos[category].forEach(todo => {
            const todoItem = document.createElement('li');
            todoItem.textContent = todo;
            todoList.appendChild(todoItem);
        });
        categoryTodoDiv.appendChild(todoList);

        container.appendChild(categoryTodoDiv);
    });
}

function addTodoToCategory(category, todoText) {
    if (todoText.trim() === '') return;
    if (!categoryTodos[category]) categoryTodos[category] = [];
    categoryTodos[category].push(todoText);
    localStorage.setItem('categoryTodos', JSON.stringify(categoryTodos));
}

window.onload = () => {
    renderCalendar();
    renderMood();
    renderMemo();
    renderTodos();
    const todoInput = document.getElementById('todoInput');
    todoInput.style.display = 'none';
    renderCategoryTodo();
};
