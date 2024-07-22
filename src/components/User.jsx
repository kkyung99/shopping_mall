export default function User({ user: { displayName } }) {
  return (
    <div className="flex items-center">
      <span className="hidden md:block text-[12px]">
        {displayName}님 반갑습니다😊
      </span>
    </div>
  );
}
