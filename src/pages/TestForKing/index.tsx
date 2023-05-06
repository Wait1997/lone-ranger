import { useRef } from 'react';
import { Input, Button } from 'antd';
import Form from '@/components/King/index';
import { type Instance } from '@/components/King/type';

export default function Kings() {
  const formEl = useRef<Instance>(null);
  return (
    <Form
      ref={formEl}
      onSubmit={async (values) => {
        const result = await formEl.current?.validateAndControlError();
        if (result) {
          console.log(values);
        }
      }}
    >
      <Form.Item
        name='name'
        label='姓名'
        rules={{
          required: true,
          message: '请输入用户姓名',
          custom: { validator: async (value) => value.length >= 2, message: '姓名必须大于等于2个字符' }
        }}
      >
        <Input placeholder='请输入姓名' />
      </Form.Item>
      <Form.Item
        name='phone'
        label='手机号'
        rules={{
          required: true,
          message: '请输入手机号',
          rule: { pattern: /^1[0-9]{10}$/, message: '请输入正确格式的手机号' }
        }}
      >
        <Input placeholder='请输入手机号' />
      </Form.Item>
      <Form.Submit>
        <Button type='primary'>提交</Button>
      </Form.Submit>
      <Button
        onClick={() => {
          formEl.current?.reset();
        }}
      >
        重置表单
      </Button>
    </Form>
  );
}
