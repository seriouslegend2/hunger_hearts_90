import React from "react";
import {
Card,
CardHeader,
CardContent,
CardDescription,
CardFooter,
CardTitle
} from "../components/ui/Card"; // Adjust path as needed

const TestPage = () => {
return (
  <div className="TestPage">
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content goes here.</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  </div>
);
};

export default TestPage;
