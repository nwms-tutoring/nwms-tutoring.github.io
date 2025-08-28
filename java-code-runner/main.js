// JDoodle API credentials (get these from https://www.jdoodle.com/compiler-api/)
// DO NOT commit your credentials to public repos!
const JDoodle_ClientId = "f7c8db43537069cffbc84dec51988ef8";
const JDoodle_ClientSecret = "c4ffb18629f18c3f2664b6db58856ffe1214370c37a7712fad944c4d27ac0395";

let files = {};
let selectedFile = null;
let editor;

// Monaco Editor loader
require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.47.0/min/vs' }});
require(['vs/editor/editor.main'], function() {
  editor = monaco.editor.create(document.getElementById('editor-container'), {
    value: '',
    language: 'java',
    theme: 'vs-dark',
    automaticLayout: true
  });
});

document.getElementById('file-input').addEventListener('change', function(e) {
  for (const file of e.target.files) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      files[file.name] = evt.target.result;
      updateFileList();
      if (!selectedFile) selectFile(file.name);
    };
    reader.readAsText(file);
  }
});

function updateFileList() {
  const ul = document.getElementById('file-list');
  ul.innerHTML = '';
  Object.keys(files).forEach(filename => {
    const li = document.createElement('li');
    li.textContent = filename;
    if (filename === selectedFile) li.classList.add('selected');
    li.onclick = () => selectFile(filename);
    ul.appendChild(li);
  });
}

function selectFile(filename) {
  selectedFile = filename;
  updateFileList();
  editor.setValue(files[filename]);
}

editor && editor.onDidChangeModelContent(() => {
  if (selectedFile) files[selectedFile] = editor.getValue();
});

document.getElementById('run-btn').onclick = async function() {
  document.getElementById('output').textContent = "Running...";
  // Java code: concatenate all files, but only run the selectedFile
  // For JDoodle, usually you send the main class only
  const code = files[selectedFile] || '';
  const payload = {
    script: code,
    language: "java",
    versionIndex: "4",
    clientId: JDoodle_ClientId,
    clientSecret: JDoodle_ClientSecret,
  };
  const resp = await fetch('https://api.jdoodle.com/v1/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const result = await resp.json();
  document.getElementById('output').textContent = result.output || result.error || JSON.stringify(result);
};
