const btn = document.getElementById("testBtn");
const output = document.getElementById("output");

btn.addEventListener("click", () => {
    const time = new Date().toLocaleTimeString();

    output.innerText = `JavaScript is working ✅ (${time})`;

    console.log("JS executed successfully at", time);
    alert("JS executed successfully!");
});

