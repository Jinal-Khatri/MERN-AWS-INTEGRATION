import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, message, Upload } from "antd";
import React, { useState } from "react";
import "./ImageUpload.css";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

export default function ImageUpload() {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [isValid, setIsValid] = useState(false);
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      setIsValid(false);
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    console.log(isJpgOrPng && isLt2M);
    return (isJpgOrPng && isLt2M) || Upload.LIST_IGNORE;
  };
  const dummyRequest = async ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess && onSuccess("ok");
    }, 0);
  };
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  return (
    <>
      <Form onFinish={(val) => console.log(val)}>
        <Form.Item
          name={"imageFile"}
          placeholder={"Upload image"}
          className={"upload-item"}
        >
          <Upload
            beforeUpload={beforeUpload}
            placeholder={"Upload image"}
            defaultFileList={[]}
            className={"upload"}
            onChange={handleChange}
            maxCount={1}
            customRequest={dummyRequest}
          >
            <p>Select Image</p>
            <Button type="link" icon={<UploadOutlined />} />
          </Upload>
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </>
  );
}
