/*
 * data:Array -> Todoリストのアイテムが挿入されている
 * id:String -> リストアイテムのUUIDを振る
 * val:String -> リストアイテムのText
 * compStatus:Boolean -> リストアイテムが完了しているか否か
 */
// const todoValue = { data: [] };
const todoValue =
  localStorage.todoItem && localStorage.todoItem !== ""
    ? JSON.parse(localStorage.todoItem)
    : { data: [] };
// const todoValue = {"data":[{"id":"ca4ef3d9-79b5-40aa-a660-4165d5fe674a","val":"dadsa","compStatus":false},{"id":"e5588b08-149a-45b1-9580-b30af6c8e0b7","val":"regrf","compStatus":true}]};

/* https://www.30secondsofcode.org/js/s/uuid-generator-browser */
const UUIDGeneratorBrowser = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );

document.querySelector("#todoAdded").addEventListener("click", () => {
  const todo = document.querySelector("#todoText");
  if (!todo.value) console.log("todoが入力されていない");
  else {
    let multi;
    /* UUIDが不運にも被ってしまったら再生成 10回まで */
    for (let i = 0; i < 10; i++) {
      multi = UUIDGeneratorBrowser();
      if (todoValue.data.filter((item) => item.id === multi) !== []) break;
      if (i === 9) {
        console.log("どんまい");
        return;
      } else console.log("再生成");
    }
    todoValue.data.push({ id: multi, val: todo.value, compStatus: false });
    todo.value = "";
    createNoCompleteItem(multi);
    saveTodos();
  }
});

const createNoCompleteItem = (id) => {
  const [li, value] = createLiVal(id);
  const comp = document.createElement("button");
  comp.innerHTML = "完了";
  comp.addEventListener("click", () => {
    todoValue.data.filter((item) => item.id === id)[0].compStatus = true;
    li.remove();
    createCompleteItem(id);
    saveTodos();
  });
  const del = document.createElement("button");
  del.innerHTML = "削除";
  del.addEventListener("click", () => {
    todoValue.data = todoValue.data.filter((item) => item.id !== id);
    li.remove();
    saveTodos();
  });
  li.append(value);
  li.append(comp);
  li.append(del);
  document.querySelector("#nocomp-items").append(li);
  saveTodos();
};

const createCompleteItem = (id) => {
  const [li, value] = createLiVal(id);
  const returnd = document.createElement("button");
  returnd.innerHTML = "戻す";
  returnd.addEventListener("click", () => {
    todoValue.data.filter((item) => item.id === id)[0].compStatus = false;
    li.remove();
    createNoCompleteItem(id);
  });
  li.append(value);
  li.append(returnd);
  document.querySelector("#comp-items").append(li);
  saveTodos();
};

const createLiVal = (id) => {
  const li = document.createElement("li");
  li.className = "item";
  const value = document.createElement("div");
  value.className = "todo-value";
  value.innerHTML = todoValue.data.filter((item) => item.id === id)[0].val;
  return [li, value];
};

const saveTodos = () => {
  const str = JSON.stringify(todoValue);
  localStorage.todoItem = str;
};

if (todoValue.data) {
  const data = todoValue.data;
  data
    .filter((item) => item.compStatus)
    .map((item) => createCompleteItem(item.id));
  data
    .filter((item) => !item.compStatus)
    .map((item) => createNoCompleteItem(item.id));
}
