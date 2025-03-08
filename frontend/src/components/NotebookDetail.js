import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

const NotebookDetail = ({ isOpen, onClose, notebook }) => {
  // Animation states
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  // If panel is not open and not animating, don't render
  if (!isOpen && !isAnimating) return null;

  // React basics dummy content
  const reactBasicsSummary = {
    title: '리액트 기본',
    date: '2025-03-07',
    content: [
      {
        section: '리액트의 기본 개념',
        points: [
          '리액트는 사용자 인터페이스를 구축하기 위한 자바스크립트 라이브러리입니다.',
          '컴포넌트 기반 아키텍처를 사용하여 재사용 가능한 UI 요소를 생성합니다.',
          'Virtual DOM을 활용하여 실제 DOM 조작을 최소화하고 성능을 최적화합니다.',
          '단방향 데이터 흐름(one-way data flow)을 사용하여 예측 가능한 상태 관리를 제공합니다.',
        ],
      },
      {
        section: 'JSX 소개',
        points: [
          'JSX는 JavaScript XML의 약자로, HTML과 유사한 구문으로 React 요소를 작성할 수 있게 해줍니다.',
          'JSX는 브라우저에서 실행되기 전에 JavaScript로 변환됩니다.',
          '중괄호 {}를 사용하여 JSX 내에서 JavaScript 표현식을 삽입할 수 있습니다.',
          'class 대신 className, for 대신 htmlFor와 같은 HTML과의 차이점이 있습니다.',
        ],
      },
      {
        section: '컴포넌트 유형',
        points: [
          '함수형 컴포넌트: 간단한 JavaScript 함수로, props를 인자로 받아 React 요소를 반환합니다.',
          '클래스형 컴포넌트: React.Component를 확장하고 render() 메서드를 구현합니다.',
          '현대 리액트에서는 함수형 컴포넌트와 훅(Hooks)을 사용하는 것이 권장됩니다.',
        ],
      },
      {
        section: 'Props와 State',
        points: [
          'Props: 부모 컴포넌트로부터 자식 컴포넌트로 데이터를 전달하는 읽기 전용 객체입니다.',
          'State: 컴포넌트 내부에서 관리되는 데이터로, 변경될 수 있습니다.',
          '함수형 컴포넌트에서는 useState 훅을 사용하여 상태를 관리합니다.',
          'state가 변경되면 컴포넌트가 다시 렌더링됩니다.',
        ],
      },
      {
        section: '리액트 훅(Hooks)',
        points: [
          'useState: 함수형 컴포넌트에서 상태를 추가하고 관리할 수 있게 합니다.',
          'useEffect: 컴포넌트의 생명주기 이벤트와 관련된 부수 효과를 처리합니다.',
          'useContext: 컴포넌트 트리 전체에 데이터를 제공하는 Context API와 함께 사용됩니다.',
          'useRef: DOM 요소에 직접 접근하거나 리렌더링을 발생시키지 않는 값을 저장합니다.',
        ],
      },
      {
        section: '이벤트 처리',
        points: [
          'React의 이벤트는 카멜 케이스(camelCase)를 사용합니다(예: onClick, onChange).',
          '이벤트 핸들러는 함수여야 합니다(함수 호출이 아님).',
          "이벤트 객체 'e'는 합성 이벤트(SyntheticEvent)로 브라우저 간 일관성을 제공합니다.",
          '클래스 컴포넌트에서는 메서드를 바인딩해야 하지만, 함수형 컴포넌트에서는 필요하지 않습니다.',
        ],
      },
      {
        section: '조건부 렌더링',
        points: [
          '삼항 연산자를 사용한 인라인 조건: condition ? true : false',
          '논리 연산자(&&)를 사용한 조건부 렌더링: condition && element',
          '조건에 따라 다른 컴포넌트를 렌더링하는 방법',
          '요소를 숨기기 위해 null을 반환하는 패턴',
        ],
      },
      {
        section: '리스트와 키(Keys)',
        points: [
          '배열 메서드 map()을 사용하여 데이터 배열을 React 요소 배열로 변환할 수 있습니다.',
          "각 리스트 항목에는 고유한 'key' prop이 필요합니다.",
          '키는 React가 항목을 식별하고 효율적으로 업데이트하는 데 도움을 줍니다.',
          '인덱스를 키로 사용하는 것은 항목 순서가 변경될 수 있는 경우 권장되지 않습니다.',
        ],
      },
    ],
  };

  // Choose content based on notebook topic
  const summaryContent =
    notebook.topic === '리액트 기본'
      ? reactBasicsSummary
      : { title: notebook.topic, date: notebook.date, content: [] };

  return (
    <div
      className={`fixed top-0 right-0 w-1/2 h-full shadow-2xl transition-all duration-500 ease-out transform z-20 ${
        isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      onTransitionEnd={() => {
        if (!isOpen) setIsAnimating(false);
      }}
      style={{
        background: '#f9fafb', // Light gray base background
      }}
    >
      {/* Main scrollable container with grid background */}
      <div
        className="h-full w-full overflow-y-auto"
        style={{
          backgroundImage: `
            linear-gradient(#e6e6e6 1px, transparent 1px),
            linear-gradient(90deg, #e6e6e6 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '-0.5px -0.5px',
        }}
      >
        {/* Left margin with binding holes - fixed position */}
        <div
          className="fixed top-0 left-0 w-12 h-full bg-gray-100 border-r border-gray-200"
          style={{
            zIndex: 30, // Above the grid but below content
          }}
        >
          {/* Paper binding holes that stay in view */}
          {Array.from({ length: 15 }).map((_, index) => (
            <div
              key={index}
              className="absolute left-4 w-4 h-4 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center overflow-hidden"
              style={{ top: `${40 + index * 50}px` }}
            >
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            </div>
          ))}
        </div>

        {/* Vertical line that extends full height - relative to the scrollable container */}
        <div
          className="absolute left-16 top-0 h-full w-px bg-gray-300"
          style={{ minHeight: '100%' }}
        ></div>

        {/* Content container with padding to account for the fixed left margin */}
        <div className="relative z-40 p-8 pl-20 min-h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium text-gray-700">요약본</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Close"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <div className="mb-6 pb-3 border-b border-gray-300">
            <h3 className="text-xl font-medium text-gray-800">
              {summaryContent.title}
            </h3>
            <p className="text-gray-500 text-sm mt-1">{summaryContent.date}</p>
          </div>

          <div className="space-y-6 pb-8">
            {summaryContent.content.map((section, index) => (
              <div key={index} className="relative">
                <h4 className="font-medium text-lg mb-2 text-gray-700 pl-5 before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-3 before:h-3 before:bg-gray-400 before:rounded-full">
                  {section.section}
                </h4>
                <ul className="pl-5 space-y-2">
                  {section.points.map((point, pointIndex) => (
                    <li
                      key={pointIndex}
                      className="text-gray-600 relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-gray-400"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotebookDetail;
