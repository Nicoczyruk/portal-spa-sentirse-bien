import shutil
import os

# Obtener el directorio actual (raíz del proyecto)
current_dir = os.getcwd()

# Rutas de origen y destino
build_path = os.path.join(current_dir, 'build')
backend_static_path = os.path.join(current_dir, 'backend', 'static')

# Eliminar la carpeta backend/static si existe
if os.path.exists(backend_static_path):
    shutil.rmtree(backend_static_path)
    print('Carpeta backend/static eliminada.')

# Crear la carpeta backend/static
os.makedirs(backend_static_path)
print('Carpeta backend/static creada.')

# Copiar archivos y carpetas de nivel superior de build/ a backend/static/
for item in os.listdir(build_path):
    s = os.path.join(build_path, item)
    d = os.path.join(backend_static_path, item)
    if item == 'static':
        # Copiar el contenido de build/static/ a backend/static/
        for subitem in os.listdir(s):
            s_subitem = os.path.join(s, subitem)
            d_subitem = os.path.join(backend_static_path, subitem)
            if os.path.isdir(s_subitem):
                shutil.copytree(s_subitem, d_subitem)
                print(f'Carpeta {subitem} copiada a backend/static/')
            else:
                shutil.copy2(s_subitem, d_subitem)
                print(f'Archivo {subitem} copiado a backend/static/')
    else:
        if os.path.isdir(s):
            shutil.copytree(s, d)
            print(f'Carpeta {item} copiada a backend/static/')
        else:
            shutil.copy2(s, d)
            print(f'Archivo {item} copiado a backend/static/')

print('Archivos de build movidos a backend/static.')
