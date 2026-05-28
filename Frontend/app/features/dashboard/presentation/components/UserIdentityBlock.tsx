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
  titleClassName = "text-[1.375rem] font-medium text-primary",
}: UserIdentityBlockProps) {
  return (
    <div className="flex items-center gap-5">
      <div className="ds-avatar ds-avatar-lg">
        <img
          src={profilePicture}
          alt={fullName}
          className="object-cover"
        />
      </div>
      <div>
        <h1 className={titleClassName}>{fullName}</h1>
        <p className="text-soft mt-1 text-sm" >{memberSinceLabel}</p>
      </div>
    </div>
  );
}
