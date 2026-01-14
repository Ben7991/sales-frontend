import { useState } from "react";
import { Link } from "react-router";
import { LuLock, LuUserCog } from "react-icons/lu";

import { Form } from "@/components/atoms/form/Form";
import { AuthLayout } from "@/components/layouts/auth/Auth";
import { Button } from "@/components/atoms/button/Button";

export function Login(): React.JSX.Element {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = (): void => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <AuthLayout
      title="Sign-in your account"
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
        <Form.Group className="mb-8">
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Enter your password"
            leftIcon={<LuLock className="text-xl" />}
            rightIcon={
              <Form.PasswordToggler
                state={showPassword}
                onClick={togglePassword}
              />
            }
          />
        </Form.Group>
        <Form.Group className="flex flex-col">
          <Button el="button" type="submit" className="py-2">
            Login
          </Button>
        </Form.Group>
      </Form>
      <p className="text-center mt-4">
        <Link to="/forgot-password" className="text-blue-600 hover:underline">
          Forgot your password?
        </Link>
      </p>
    </AuthLayout>
  );
}
