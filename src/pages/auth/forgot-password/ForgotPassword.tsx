import { Link } from "react-router";
import { LuUserCog } from "react-icons/lu";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button } from "@/components/atoms/button/Button";
import { Form } from "@/components/atoms/form/Form";
import { AuthLayout } from "@/components/layouts/auth/Auth";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { ForgotPasswordInputs } from "./ForgotPassword.types";
import {
  forgotPasswordSchema,
  requestPasswordReset,
} from "./ForgotPassword.util";
import { useState } from "react";
import { useAlert } from "@/components/molecules/alert/Alert.hooks";
import { Alert } from "@/components/molecules/alert/Alert";

export function ForgotPassword(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ForgotPasswordInputs>({
    resolver: yupResolver(forgotPasswordSchema),
    mode: "onBlur",
  });
  const { state, alertDetails, showAlert, hideAlert, setAlertDetails } =
    useAlert();

  const onSubmit: SubmitHandler<ForgotPasswordInputs> = async (
    data,
  ): Promise<void> => {
    setIsLoading(true);

    try {
      const result = await requestPasswordReset(data);
      setAlertDetails({
        message: result.message,
        variant: "success",
      });
      reset();
    } catch (error) {
      setAlertDetails({
        message: (error as Error).message,
        variant: "error",
      });
      console.log("Failed to request password reset", error);
    } finally {
      showAlert();
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password"
      description="Please enter your email and password to access your account settings and dashboard."
    >
      {state ? (
        <Alert
          variant={alertDetails?.variant ?? "error"}
          message={alertDetails?.message ?? ""}
          onHide={hideAlert}
        />
      ) : null}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-8">
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="text"
            id="email"
            placeholder="Enter your email"
            {...register("email")}
            hasError={Boolean(errors.email)}
            leftIcon={<LuUserCog className="text-xl" />}
          />
          {Boolean(errors.email) && (
            <Form.Error>{errors.email?.message}</Form.Error>
          )}
        </Form.Group>
        <Form.Group className="flex flex-col">
          <Button
            el="button"
            type="submit"
            className="py-2"
            disabled={isLoading || !isValid}
          >
            {isLoading ? <Button.Loader /> : "Submit"}
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
