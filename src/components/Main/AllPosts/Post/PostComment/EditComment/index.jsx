import React from 'react';
import { Form, Button, Input } from 'antd';

const { TextArea } = Input;

// 输入框
const EditComment = ({ onChange, onSubmit, submitting, value, postAuthor }) => (
    <>
        <Form.Item>
            <TextArea
                maxLength={200}
                autoSize={{minRows: 1, maxRows: 2}}
                onChange={onChange}
                value={value}
                placeholder={`回复 ${postAuthor} :`}
            />
        </Form.Item>
        <Form.Item>
            <Button
                htmlType="submit"
                loading={submitting}
                onClick={onSubmit}
                type="primary"
            >
                回复
            </Button>
        </Form.Item>
    </>
)

export default EditComment;
