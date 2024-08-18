from fastapi import FastAPI
from pydantic import BaseModel
from sympy import symbols, Matrix
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas las fuentes; modifica según tus necesidades
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos HTTP
    allow_headers=["*"],  # Permite todos los encabezados
)

# Definir las variables simbólicas
R1, R2, R3, R4, R5, V1, V2, V3 = symbols('R1 R2 R3 R4 R5 V1 V2 V3')

# Definir la matriz completa (incluyendo los términos independientes)
matrix = Matrix([
    [R2 + R4, -R2, -R4, V1],
    [-R2, R1 + R3 + R2,-R3, V2],
    [-R4,-R3, R5 + R4 + R3, -V3]
])

class InputValues(BaseModel):
    R1: float
    R2: float
    R3: float
    R4: float
    R5: float
    V1: float
    V2: float
    V3: float

@app.post("/calculate")
def calculate(values: InputValues):
    # Reemplazar los valores en la matriz
    replacements = {
        R1: values.R1,
        R2: values.R2,
        R3: values.R3,
        R4: values.R4,
        R5: values.R5,
        V1: values.V1,
        V2: values.V2,
        V3: values.V3
    }

    matrix_with_values = matrix.subs(replacements)

    # Separar la matriz de coeficientes y el vector de términos independientes
    A = matrix_with_values[:, :-1]  # Matriz de coeficientes (3x3)
    b = matrix_with_values[:, -1]   # Vector de términos independientes (3x1)

    # Resolver el sistema de ecuaciones Ax = b
    solution = A.LUsolve(b)

    i1, i2, i3 = solution

    # Calcular VR1, VR2, VR3, etc.
    VR1 = i2 * values.R1
    VR2 = values.R2 * (i1 - i2)
    VR3 = values.R3 * (i3 - i2)
    VR4 = values.R4 * (i1 - i3)
    VR5 = values.R5 * i3
    IAC = VR1 / values.R1
    IAB = VR2 / values.R2
    IBC = VR3 / values.R3
    IAD = i1
    IDC = i3
    IBD = VR4 / values.R4

    # Convertir los resultados a tipos nativos de Python
    response = {
        "VR1": float(VR1),
        "VR2": float(VR2),
        "VR3": float(VR3),
        "VR4": float(VR4),
        "VR5": float(VR5),
        "IAC": float(IAC),
        "IAB": float(IAB),
        "IBC": float(IBC),
        "IAD": float(IAD),
        "IDC": float(IDC),
        "IBD": float(IBD),
    }

    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)