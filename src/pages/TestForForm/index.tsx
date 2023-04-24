import Form from '@/components/Form';
import { useForm } from '@/components/Form/hook';
import { Button, Input, Select } from 'antd';

export default function TestForForm() {
  const form = useForm();

  return (
    <Form
      form={form}
      onFinish={(values) => {
        console.log(values);
      }}
      onFinishFailed={(values, errorFields) => {
        console.log(values);
        console.log(errorFields);
      }}
    >
      <Form.Item
        name='name'
        label='请输入小册名称'
        rules={{ rule: (value) => value.length > 5, message: '小册名称大于5' }}
        required
      >
        <Input placeholder='请输入小册名称' />
      </Form.Item>
      <Form.Item name='author' label='作者'>
        <Input placeholder='请输入作者' />
      </Form.Item>
      <Form.Item name='email' label='邮箱'>
        <Input placeholder='请输入邮箱' />
      </Form.Item>
      <Form.Item name='phone' label='手机号'>
        <Input placeholder='请输入手机号' />
      </Form.Item>
      <Form.Item name='desc' label='简介'>
        <Input placeholder='请输入简介' />
      </Form.Item>
      <Form.Item name='likes' label='最喜欢的前端框架'>
        <Select
          style={{ width: 360 }}
          placeholder='请选择'
          options={[
            { label: 'Vue', value: 'Vue' },
            { label: 'React', value: 'React' }
          ]}
          allowClear
        />
      </Form.Item>
      <Form.Item>
        <Button style={{ width: 240 }} htmlType='submit' type='primary'>
          提交
        </Button>
      </Form.Item>
    </Form>
  );
}
