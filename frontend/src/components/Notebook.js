import React from 'react';

const Notebook = ({ date, topic, onClick }) => {
  return (
    <button
      className="relative w-52 h-64 bg-yellow-300 rounded-2xl shadow-md transition-transform duration-300 ease-in-out hover:translate-y-[-10px] hover:shadow-xl"
      onClick={() => onClick({ date, topic })}
    >
      {/* 왼쪽 파란색 접힌 부분 */}
      <div className="absolute top-0 left-0 w-8 h-full bg-blue-400 rounded-l-2xl"></div>

      {/* 스프링 표현 */}
      {[1, 2, 3, 4].map((_, i) => (
        <div
          key={i}
          className="absolute left-1 w-5 h-4 bg-blue-500 rounded-full"
          style={{ top: `${40 + i * 50}px` }}
        ></div>
      ))}

      {/* 오른쪽 인덱스 태그 */}
      {['bg-red-300', 'bg-yellow-200', 'bg-green-300'].map((color, i) => (
        <div
          key={i}
          className={`absolute right-[-15px] w-4 h-8 ${color} rounded-r-md`}
          style={{ top: `${30 + i * 60}px` }}
        ></div>
      ))}

      {/* 공책 본체 */}
      <div className="flex flex-col items-center justify-center h-full ml-8 font-pretendard">
        <div className="relative bg-yellow-100 w-36 min-h-24 p-4 rounded-md flex flex-col items-center justify-center shadow group">
          <h2 className="text-lg font-bold text-gray-700 text-center line-clamp-2 text-ellipsis">
            {topic}
          </h2>
          <div className="text-sm mt-2 text-gray-600">
            <p>{date}</p>
          </div>
        </div>
      </div>
    </button>
  );
};

export default Notebook;
// import React from 'react';

// // 카테고리별 노트북 커버 색상 설정
// const notebookColors = {
//   math: {
//     name: '수학',
//     cover: 'bg-sky-300',
//     background: 'bg-sky-100',
//     textColor: 'text-sky-800',
//   },
//   science: {
//     name: '과학',
//     cover: 'bg-green-300',
//     background: 'bg-green-100',
//     textColor: 'text-green-800',
//   },
//   language: {
//     name: '언어',
//     cover: 'bg-purple-300',
//     background: 'bg-purple-100',
//     textColor: 'text-purple-800',
//   },
//   history: {
//     name: '역사',
//     cover: 'bg-yellow-300',
//     background: 'bg-yellow-100',
//     textColor: 'text-yellow-800',
//   },
//   art: {
//     name: '예술',
//     cover: 'bg-pink-300',
//     background: 'bg-pink-100',
//     textColor: 'text-pink-800',
//   },
//   social: {
//     name: '사회',
//     cover: 'bg-rose-300',
//     background: 'bg-rose-100',
//     textColor: 'text-rose-800',
//   },
//   programming: {
//     name: '프로그래밍',
//     cover: 'bg-gray-300',
//     background: 'bg-gray-100',
//     textColor: 'text-gray-800',
//   },
// };

// const Notebook = ({ date, topic, category = 'social', onClick }) => {
//   // 카테고리에 맞는 커버 색상 선택 (없으면 기본 노란색 유지)
//   const colorStyle = category ? notebookColors[category] : null;

//   return (
//     <button
//       className={`relative w-52 h-64 ${
//         colorStyle ? colorStyle.cover : 'bg-yellow-300'
//       } rounded-2xl shadow-md transition-transform duration-300 ease-in-out hover:translate-y-[-10px] hover:shadow-xl`}
//       onClick={() => onClick({ date, topic, category })}
//     >
//       {/* 카테고리 이름 뱃지 (선택적으로 표시) */}
//       {colorStyle && (
//         <div className="absolute -top-2 left-0 right-0 flex justify-center">
//           <div className="bg-white bg-opacity-90 text-xs px-3 py-1 rounded-full shadow-sm font-semibold">
//             {colorStyle.name}
//           </div>
//         </div>
//       )}

//       {/* 왼쪽 파란색 접힌 부분 (원래 디자인 유지) */}
//       <div className="absolute top-0 left-0 w-8 h-full bg-blue-400 rounded-l-2xl"></div>

//       {/* 스프링 표현 (원래 디자인 유지) */}
//       {[1, 2, 3, 4].map((_, i) => (
//         <div
//           key={i}
//           className="absolute left-1 w-5 h-4 bg-blue-500 rounded-full"
//           style={{ top: `${40 + i * 50}px` }}
//         ></div>
//       ))}

//       {/* 오른쪽 인덱스 태그 (원래 디자인 유지) */}
//       {['bg-red-300', 'bg-yellow-200', 'bg-green-300'].map((color, i) => (
//         <div
//           key={i}
//           className={`absolute right-[-15px] w-4 h-8 ${color} rounded-r-md`}
//           style={{ top: `${30 + i * 60}px` }}
//         ></div>
//       ))}

//       {/* 공책 본체 색상은 유지 */}
//       <div className="flex flex-col items-center justify-center h-full ml-8 font-pretendard">
//         <div
//           className={`relative ${
//             colorStyle ? colorStyle.background : 'bg-yellow-100'
//           } w-36 min-h-24 p-4 rounded-md flex flex-col items-center justify-center shadow group`}
//         >
//           <h2 className="text-lg font-bold text-gray-700 text-center line-clamp-2 text-ellipsis">
//             {topic}
//           </h2>
//           <div className="text-sm mt-2 text-gray-600">
//             <p>{date}</p>
//           </div>
//         </div>
//       </div>
//     </button>
//   );
// };

// export default Notebook;
