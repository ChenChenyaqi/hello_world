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
                style={{width:'90%', borderRadius:'6px'}}
            />
        </Form.Item>
        <Form.Item>
            <Button
                style={{borderRadius:'6px'}}
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
