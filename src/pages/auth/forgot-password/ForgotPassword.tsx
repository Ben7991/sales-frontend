import { Link } from "react-router";
import { LuUserCog } from "react-icons/lu";

import { Button } from "@/components/atoms/button/Button";
import { Form } from "@/components/atoms/form/Form";
import { AuthLayout } from "@/components/layouts/auth/Auth";

export function ForgotPassword(): React.JSX.Element {
  return (
    <AuthLayout
      title="Forgot Password"
      description="Please enter your email and password to access your account settings and dashboard."
    >
      <Form>
        <Form.Group className="mb-4">
          <Form.Label htmlFor="userName">Username</Form.Label>
          <Form.Control
            type="text"
            id="userName"
            placeholder="Enter your username"
            leftIcon={<LuUserCog className="text-xl" />}
          />
        </Form.Group>
        <Form.Group className="flex flex-col">
          <Button el="button" type="submit" className="py-2">
            Submit
          </Button>
        </Form.Group>
      </Form>
      <p className="text-center mt-4">
        Already have an account?{" "}
        <Link to="/" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}
