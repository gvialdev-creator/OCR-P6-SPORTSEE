type UserIdentityBlockProps = {
  fullName: string;
  memberSinceLabel: string;
  profilePicture: string;
  titleClassName?: string;
};

export function UserIdentityBlock({
  fullName,
  memberSinceLabel,
  profilePicture,
  titleClassName = "text-4xl font-semibold text-primary",
}: UserIdentityBlockProps) {
  return (
    <div className="flex items-center gap-5">
      <img
        src={profilePicture}
        alt={fullName}
        className="ds-avatar ds-avatar-lg"
      />
      <div>
        <h1 className={titleClassName}>{fullName}</h1>
        <p className="text-soft mt-1 text-base">{memberSinceLabel}</p>
      </div>
    </div>
  );
}
