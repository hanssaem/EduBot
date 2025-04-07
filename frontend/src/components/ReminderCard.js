import { CalendarIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

export default function ReminderCard({ notes = [], onReviewAll, onNoteClick }) {
  return (
    <div className="bg-blue-600 text-white rounded-2xl p-6 w-[1200px] shadow-md mt-10 font-pretendard">
      <div className="flex items-center mb-4">
        <div className="bg-blue-500 p-3 rounded-full mr-4">
          <CalendarIcon className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">오늘의 복습</h2>
          <p className="text-sm text-blue-100">
            {notes.length}개의 복습할 노트가 있습니다
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {notes.map((note, idx) => (
          <button
            key={idx}
            onClick={() => onNoteClick?.(note)}
            className="w-full flex items-center justify-between bg-blue-500 px-4 py-3 rounded-lg hover:bg-blue-400 transition"
          >
            <div className="flex items-center">
              <span
                className={`w-3 h-3 rounded-full mr-3`}
                style={{ backgroundColor: note.color }}
              ></span>
              <span className="text-left">{note.title}</span>
            </div>
            <ChevronRightIcon className="w-4 h-4 text-white" />
          </button>
        ))}
      </div>

      {/* <hr className="my-4 border-blue-400" />

      <button
        onClick={onReviewAll}
        className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-xl hover:bg-blue-100 transition"
      >
        모든 노트 복습하기
      </button> */}
    </div>
  );
}
