import { useState } from "react";
import { LuLock } from "react-icons/lu";

import { Button } from "@/components/atoms/button/Button";
import { Form } from "@/components/atoms/form/Form";
import { AuthLayout } from "@/components/layouts/auth/Auth";

export function ResetPassword(): React.JSX.Element {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <AuthLayout
      title="Sign-in your account"
      description="Please enter your email and password to access your account settings and dashboard."
    >
      <Form>
        <Form.Group className="mb-4">
          <Form.Label htmlFor="newPassword">New Password</Form.Label>
          <Form.Control
            type={showNewPassword ? "text" : "password"}
            id="newPassword"
            placeholder="Enter your new password"
            leftIcon={<LuLock className="text-xl" />}
            rightIcon={
              <Form.PasswordToggler
                state={showNewPassword}
                onClick={() => setShowNewPassword((prevState) => !prevState)}
              />
            }
          />
        </Form.Group>
        <Form.Group className="mb-8">
          <Form.Label htmlFor="confirmPassword">Confirm Password</Form.Label>
          <Form.Control
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            placeholder="Confirm your new password"
            leftIcon={<LuLock className="text-xl" />}
            rightIcon={
              <Form.PasswordToggler
                state={showConfirmPassword}
                onClick={() =>
                  setShowConfirmPassword((prevState) => !prevState)
                }
              />
            }
          />
        </Form.Group>
        <Form.Group className="flex flex-col">
          <Button el="button" type="submit" className="py-2">
            Submit
          </Button>
        </Form.Group>
      </Form>
    </AuthLayout>
  );
}
