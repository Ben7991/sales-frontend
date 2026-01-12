import { Outlet } from "react-router";

export function Dashboard(): React.JSX.Element {
  return (
    <main>
      <aside>aside</aside>
      <article>
        <Outlet />
      </article>
    </main>
  );
}
