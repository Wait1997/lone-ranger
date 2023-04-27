export default class FormInstance {
  private readonly model: any;
  constructor(initialValues: Record<string, unknown>) {
    this.model = {};
  }
}
