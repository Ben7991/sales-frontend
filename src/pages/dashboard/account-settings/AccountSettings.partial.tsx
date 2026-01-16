import { MdOutlineSaveAlt } from "react-icons/md";
import { CgDanger } from "react-icons/cg";

import { Button } from "@/components/atoms/button/Button";
import { Form } from "@/components/atoms/form/Form";

function Wrapper(props: { children: React.ReactNode }): React.JSX.Element {
  return <div className="w-full md:w-112.5">{props.children}</div>;
}

export function PersonalInformation(): React.JSX.Element {
  return (
    <Wrapper>
      <Form>
        <Form.Group className="mb-4">
          <Form.Label htmlFor="name">Name</Form.Label>
          <Form.Control type="text" id="name" />
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label htmlFor="username">Username</Form.Label>
          <Form.Control type="text" id="username" />
        </Form.Group>
        <Form.Group className="mb-8">
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control type="email" id="email" />
        </Form.Group>
        <Button el="button" type="submit" className="flex! items-center gap-2">
          <MdOutlineSaveAlt className="text-xl" />
          <span>Save changes</span>
        </Button>
      </Form>
    </Wrapper>
  );
}

export function ChangePassword(): React.JSX.Element {
  return (
    <Wrapper>
      <div className="mb-5 p-4 rounded-sm bg-red-100 text-red-600 flex gap-2 items-start">
        <div className="basis-12">
          <CgDanger className="text-3xl" />
        </div>
        <p>
          Please note that when the form is submitted and is successfully, the
          system will log you out and redirect you to the login page to try
          logging in with your new password
        </p>
      </div>
      <Form>
        <Form.Group className="mb-4">
          <Form.Label htmlFor="current_password">Current Password</Form.Label>
          <Form.Control type="password" id="current_password" />
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label htmlFor="new_password">New Password</Form.Label>
          <Form.Control type="password" id="new_password" />
        </Form.Group>
        <Form.Group className="mb-8">
          <Form.Label htmlFor="confirm_password">Confirm Password</Form.Label>
          <Form.Control type="password" id="confirm_password" />
        </Form.Group>
        <Button el="button" type="submit" className="flex! items-center gap-1">
          <MdOutlineSaveAlt className="text-xl" />
          <span>Save changes</span>
        </Button>
      </Form>
    </Wrapper>
  );
}
