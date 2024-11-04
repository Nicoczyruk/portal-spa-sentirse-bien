// InstallPromptModal.js
import React from 'react';

const InstallPromptModal = ({ isOpen, onClose, isIos }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className="bg-white rounded-lg p-4 w-full max-w-md mx-4 overflow-y-auto"
        style={{ maxHeight: '90vh' }}
      >
        <h2 className="text-xl font-bold mb-4 text-center">Cómo instalar la aplicación</h2>
        {isIos ? (
          <div>
            <p className="mb-4 text-center">
              Para instalar esta aplicación en tu dispositivo iOS, sigue estos pasos:
            </p>
            <ol className="list-decimal list-inside">
              <li className="mb-4">
                Presiona el botón de compartir en la barra inferior de Safari.
                <img
                  src="/paso1.png"
                  alt="Paso 1"
                  className="my-2 w-full max-w-xs mx-auto"
                />
              </li>
              <li className="mb-4">
                Desplázate y selecciona <strong>'Añadir a pantalla de inicio'</strong>.
                <img
                  src="/paso2.png"
                  alt="Paso 2"
                  className="my-2 w-full max-w-xs mx-auto"
                />
              </li>
              <li className="mb-4">
                Confirma el nombre y presiona <strong>'Añadir'</strong>.
                <img
                  src="/paso3.png"
                  alt="Paso 3"
                  className="my-2 w-full max-w-xs mx-auto"
                />
              </li>
            </ol>
          </div>
        ) : (
          <div>
            <p className="mb-4 text-center">
              Para instalar esta aplicación en tu dispositivo Android, sigue estos pasos:
            </p>
            <ol className="list-decimal list-inside">
              <li className="mb-4">
                Presiona el menú de opciones (tres puntos) en la esquina superior derecha.
                <img
                  src="/paso1.png"
                  alt="Paso 1"
                  className="my-2 w-full max-w-xs mx-auto"
                />
              </li>
              <li className="mb-4">
                Selecciona <strong>'Añadir a pantalla de inicio'</strong>.
                <img
                  src="/paso2.png"
                  alt="Paso 2"
                  className="my-2 w-full max-w-xs mx-auto"
                />
              </li>
              <li className="mb-4">
                Confirma el nombre y presiona <strong>'Añadir'</strong>.
                <img
                  src="/paso3.png"
                  alt="Paso 3"
                  className="my-2 w-full max-w-xs mx-auto"
                />
              </li>
            </ol>
          </div>
        )}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-500"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default InstallPromptModal;
