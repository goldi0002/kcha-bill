export function LoginPage({
  username,
  password,
  setUsername,
  setPassword,
  login
}: {
  username: string;
  password: string;
  setUsername: (value: string) => void;
  setPassword: (value: string) => void;
  login: () => void;
}) {
  return (
    <section className="card card-center auth-card">
      <div className="section-heading">
        <h2>Welcome back</h2>
        <p>Sign in to continue managing inventory and billing.</p>
      </div>
      <div className="stack">
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button className="btn-primary" onClick={login}>Login</button>
      </div>
      <p className="hint">Demo account: owner / owner123</p>
    </section>
  );
}
