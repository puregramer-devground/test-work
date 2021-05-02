import Board from "./components/Board";

window.addEventListener("DOMContentLoaded", ((event: Event) => {
    console.log("DOMContentLoaded!");
    const workRoot = document.getElementById("workRoot") as HTMLElement;
    const testWork = new Board(workRoot, "TEST-WORK");

}) as EventListener);

