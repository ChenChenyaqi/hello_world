import React from 'react';
import { Form, Button, Input } from 'antd';

const { TextArea } = Input;

// 输入框
const EditComment = ({ onChange, onSubmit, submitting, value }) => (
    <>
        <Form.Item>
            <TextArea
                maxLength={200}
                autoSize={{minRows: 1, maxRows: 2}}
                onChange={onChange}
                value={value}
                placeholder={'发条友善的评论吧~~~'}
            />
        </Form.Item>
        <Form.Item>
            <Button
                htmlType="submit"
                loading={submitting}
                onClick={onSubmit}
                type="primary"
            >
                评论
            </Button>
        </Form.Item>
    </>
)

export default EditComment;
