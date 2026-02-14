function runCode() {
    const html = document.getElementById("htmlCode").value;
    const css = document.getElementById("cssCode").value;
    const js = document.getElementById("jsCode").value;

    const output = document.getElementById("output").contentWindow.document;

    output.open();
    output.write(`
        <html>
        <head>
        <style>${css}</style>
        </head>
        <body>
        ${html}
        <script>
        ${js}
        <\/script>
        </body>
        </html>
    `);
    output.close();
}
