import { useState } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Card from "./components/Card";
import Button from "./components/Button";
import Form from "./components/Form";

function App() {

  const [count, setCount] = useState(0);

  const increaseCount = () => {
    setCount(count + 1);
  };

  return (
    <div>

      <Header />

      <main>

        <h2>React Components Practice</h2>

        {/* Cards using Props */}

        <Card
          title="React"
          description="Library for building user interfaces."
        />

        <Card
          title="JavaScript"
          description="Programming language used for web development."
        />

        <Card
          title="CSS"
          description="Used to style web pages."
        />


        {/* Button using Props and State */}

        <h3>Count: {count}</h3>

        <Button
          text="Increase Count"
          onClick={increaseCount}
        />


        {/* Form */}

        <h3>Contact Form</h3>

        <Form />

      </main>

      <Footer />

    </div>
  );
}

export default App;