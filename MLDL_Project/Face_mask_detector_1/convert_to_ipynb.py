import nbformat
from nbformat.v4 import new_notebook, new_code_cell

nb = new_notebook()

with open("train_model.py", "r") as f:
    code = f.read()

nb.cells.append(new_code_cell(code))

with open("train_model.ipynb", "w") as f:
    nbformat.write(nb, f)

print("Created train_model.ipynb!")
