import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LuLock } from "react-icons/lu";

import { Button } from "@/components/atoms/button/Button";
import { Form } from "@/components/atoms/form/Form";
import { AuthLayout } from "@/components/layouts/auth/Auth";
import type { ResetPasswordInputs } from "./ResetPassword.types";
import {
  resetPasswordWithToken,
  resetPasswwordSchema,
} from "./ResetPassword.utils";
import { useAlert } from "@/components/molecules/alert/Alert.hooks";
import { Alert } from "@/components/molecules/alert/Alert";

export function ResetPassword(): React.JSX.Element {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { alertDetails, hideAlert, setAlertDetails } = useAlert();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ResetPasswordInputs>({
    resolver: yupResolver(resetPasswwordSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<ResetPasswordInputs> = async (
    data,
  ): Promise<void> => {
    setIsLoading(true);

    try {
      const token = searchParams.get("token") as string;
      const result = await resetPasswordWithToken(data, token);
      setAlertDetails({
        message: result.message,
        variant: "success",
      });
      reset();
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setAlertDetails({
        message: (error as Error).message,
        variant: "error",
      });
      console.log("Failed to reset password", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign-in your account"
      description="Please enter your email and password to access your account settings and dashboard."
    >
      {alertDetails ? (
        <Alert
          variant={alertDetails.variant}
          message={alertDetails.message}
          onHide={hideAlert}
        />
      ) : null}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-4">
          <Form.Label htmlFor="newPassword">New Password</Form.Label>
          <Form.Control
            type={showNewPassword ? "text" : "password"}
            id="newPassword"
            placeholder="Enter your new password"
            {...register("newPassword")}
            hasError={Boolean(errors.newPassword)}
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
            {...register("confirmPassword")}
            hasError={Boolean(errors.confirmPassword)}
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
          <Button
            el="button"
            variant="primary"
            type="submit"
            className="py-2"
            disabled={isLoading || !isValid}
          >
            {isLoading ? <Button.Loader /> : "Submit"}
          </Button>
        </Form.Group>
      </Form>
    </AuthLayout>
  );
}
