  // app/page.tsx (or pages/index.tsx if using Pages Router)
  export default function Home() {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Welcome to My App</h1>
        <p>This is your custom home page. The default Next.js page has been replaced!</p>
        <a href="/assignments" style={{ color: 'blue', textDecoration: 'underline' }}>
          Go to Assignments
        </a>
        {/* Add more content here, like a nav bar or footer */}
      </div>
    );
  }
  
