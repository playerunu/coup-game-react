import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Level } from 'containers/Level';
import { MultiBackend } from 'react-dnd-multi-backend';
import { HTML5toTouch } from 'rdndmb-html5-to-touch';
import { DndProvider } from 'react-dnd';
import { CustomDragLayerProvider } from 'contexts/custom-drag-layer/provider';

const App: React.FC = () => {
  return (
    <>
      <DndProvider backend={MultiBackend} options={HTML5toTouch}>
        <CustomDragLayerProvider>
          <Router>
            <Routes>
              <Route path="*" element={<Level />} />
            </Routes>
          </Router>
        </CustomDragLayerProvider>
      </DndProvider>
    </>
  );
};

export default App;
