type AppHeaderProps = {
  children: React.ReactNode;
};

export default function AppHeader({ children }: AppHeaderProps) {
  return <header>{children}</header>;
}
