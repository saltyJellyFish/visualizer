import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

// --- Reusable Hook for Undo/Redo (Corrected for Stability) ---
export const useHistory = (initialState) => {
    const [state, setStateInternal] = useState({
        history: [initialState],
        currentIndex: 0,
    });

    const { history, currentIndex } = state;

    const setState = useCallback((action, overwrite = false) => {
        setStateInternal(currentState => {
            const { history, currentIndex } = currentState;
            const newCurrentState = history[currentIndex];
            const newState = typeof action === 'function' ? action(newCurrentState) : action;

            if (overwrite) {
                const newHistory = [...history];
                newHistory[currentIndex] = newState;
                return { ...currentState, history: newHistory };
            }

            const newHistory = history.slice(0, currentIndex + 1);
            return {
                history: [...newHistory, newState],
                currentIndex: newHistory.length,
            };
        });
    }, []);

    const undo = useCallback(() => {
        setStateInternal(currentState => {
            if (currentState.currentIndex > 0) {
                return { ...currentState, currentIndex: currentState.currentIndex - 1 };
            }
            return currentState;
        });
    }, []);

    const redo = useCallback(() => {
        setStateInternal(currentState => {
            if (currentState.currentIndex < currentState.history.length - 1) {
                return { ...currentState, currentIndex: currentState.currentIndex + 1 };
            }
            return currentState;
        });
    }, []);

    return [history[currentIndex], setState, undo, redo];
};


// --- Reusable Code View Component ---
const codeSnippets = {
  'Singly': {
    'JavaScript': `class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  // ...
  insert(data, index) {
    const newNode = new Node(data);
    if (index === 0) {
      newNode.next = this.head;
      this.head = newNode;
      return;
    }
    let current = this.head;
    let i = 0;
    while (current.next && i < index - 1) {
      current = current.next;
      i++;
    }
    newNode.next = current.next;
    current.next = newNode;
  }
}`,
    'Python': `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    # ...
    def insert(self, data, index):
        new_node = Node(data)
        if index == 0:
            new_node.next = self.head
            self.head = new_node
            return
        current = self.head
        i = 0
        while current.next and i < index - 1:
            current = current.next
            i += 1
        new_node.next = current.next
        current.next = new_node`
  },
  // Add code for Doubly and Circular lists here
};

export function CodeView({ dataStructure }) {
  const [lang, setLang] = useState('JavaScript');
  const snippets = codeSnippets[dataStructure] || {};

  return (
    <div className="bg-darkBlue text-white p-4 rounded-lg mt-6 w-full max-w-2xl">
      <div className="flex space-x-2 mb-2">
        {Object.keys(snippets).map(l => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-3 py-1 text-sm rounded ${lang === l ? 'bg-pinkZ' : 'bg-gray-600'}`}
          >
            {l}
          </button>
        ))}
      </div>
      <pre className="overflow-x-auto">
        <code>{snippets[lang]}</code>
      </pre>
    </div>
  );
}

// --- Random Data Generator ---
export function generateRandomStringArray(size = 5, length = 1) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const result = new Set();
    while(result.size < size) {
        let randomString = '';
        for (let i = 0; i < length; i++) {
            randomString += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        result.add(randomString);
    }
    return Array.from(result);
}

// --- Existing Components ---

export function BackToHomeButton() {
  return (
    <Link to="/" className="homeLink">
      ← Back to Home
    </Link>
  );
}

export function VisualizerPage({ title, description, children }) {
  return (
    <div className="mainContentWrapper p-10 font-ancizar">
      <BackToHomeButton />
      <div className="my-20">
        <h1 className="dsaName">{title}</h1>
        <p className="dsaDesc">{description}</p>
      </div>
      <div className="cardDesc">
        {children}
      </div>
      <footer className="footer mt-auto">
        &copy; {new Date().getFullYear()} DSA Visualizer
      </footer>
    </div>
  );
}

export function ButtonZ({ buttons }) {
  return (
    <div className="flex gap-2 w-full flex-col md:flex-row justify-evenly">
      {buttons.map(({ label, action, opacity, hoverText }) => (
        <div key={label} className="relative group flex-grow justify-evenly">
          <button
            onClick={action}
            className={`buttons ${opacity} bg-seaGreen w-full`}
          >
            {label}
          </button>
          <div className="buttonHover">
            {hoverText}
          </div>
        </div>
      ))}
    </div>
  );
}

export function InputValue({ inputValue, setInputValue }) {
  return (
    <div className="relative flex flex-grow-0 sm:flex-col w-full">
      <input
        type="text"
        placeholder="Input elements"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        className="searchBoxPlaceholder w-full "
      />
      <div className="buttonHover">
        Enter values separated by commas or spaces.
      </div>
    </div>
  );
}
export function InputIndex({ insertIndex, setInsertIndex }) {
  return (
    <div className="relative flex flex-grow-0 sm:flex-col w-full">
      <input
        type="number"
        placeholder="Index (optional)"
        value={insertIndex}
        onChange={e => setInsertIndex(e.target.value)}
        className="searchBoxPlaceholder w-full"
      />
      <div className="buttonHover">
        Specify index for insertion/removal (leave empty for end/last).
      </div>
    </div>
  );
}
export function insertion({ inputValue, setError, setInputValue }) {
  return function(updateStructure) {
    setError('');
    const vals = inputValue.split(/[\s,]+/).filter(v => v);
    if (!vals.length) {
      setError('Enter one or more values.');
      return;
    }
    updateStructure(prev => [...prev, ...vals]);
    setInputValue('');
  };
}

export function Deletion({ setError, emptyMessage }) {
  return function(updateStructure, getStructure, removeFn) {
    setError('');
    const current = getStructure();
    if (current.length === 0) {
      setError(emptyMessage);
      return;
    }
    updateStructure(removeFn(current));
  };
}

export function Peek({ setError, setPeekValue, emptyMessage }) {
  return function(getStructure, peekFn) {
    setError('');
    const current = getStructure();
    if (current.length === 0) {
      setError(emptyMessage);
      return;
    }
    setPeekValue(peekFn(current));
  };
}