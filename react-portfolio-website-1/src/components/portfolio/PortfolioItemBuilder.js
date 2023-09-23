function MyComponent() {
    return (
      <div>
        <h1>Data from JSON</h1>
        <ul>
          {jsonData.map(item => (
            <li key={item.id}>
              <p>ID: {item.id}</p>
              <p>Title: {item.title}</p>
              <p>GitHub: {item.github}</p>
              <p>Demo: {item.demo}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  