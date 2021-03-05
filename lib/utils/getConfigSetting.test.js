import { getConfigSetting } from './getConfigSetting';

describe('getConfigSetting', () => {
  it('should return default config value if settings are empty', () => {
    const settingConfig = getConfigSetting();

    expect(settingConfig).toEqual({});
  });

  it('should return parsed config object', () => {
    const settingConfig = getConfigSetting([{ value: '{"isApprovalRequired":true}' }], { isApprovalRequired: false });

    expect(settingConfig).toEqual({ isApprovalRequired: true });
  });
});
