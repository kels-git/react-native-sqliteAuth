import React, { useCallback, useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView } from 'react-native';
import { ResponsiveUi } from 'src/components/responsive-ui/responsive-ui';
import { AuthRedirectText } from 'src/components/wrappers-component/Authredirect-text';
import TextInputCustomComponent from 'src/components/wrappers-component/ContainerTextInput';
import ContainerWrapper from 'src/components/wrappers-component/ContainerWrapper';
import ErrorTextWrapper from 'src/components/wrappers-component/ErrorTextWrapper';
import LottieWrapper from 'src/components/wrappers-component/LottieWrapper';
import { LabelsText } from 'src/enums/labels-text/labels';
import { SCREENS } from 'src/enums/screens/screens';
import { clearError, loginWithEmail } from 'src/global/auth/auth-slice';
import { useAppDispatch, useAppSelector } from 'src/global/store/hooks';
import { useloading } from 'src/services/load/loading-services';
import { LoginAuth, ValidationErrors } from 'src/typings/input-typings';
import { RootStackScreenProps } from 'src/typings/navigation';
import { getColorValue, validationHelpers } from 'src/utils/utils';
import { useTailwind } from 'tailwind-rn';

const IndexLoginEmailContainer = ({ navigation }: RootStackScreenProps<SCREENS.Login_page>) => {

    const tailwind = useTailwind();
    const { setIsloading } = useloading();
    const dispatch = useAppDispatch();
    const blackColor = getColorValue('text-black-pure', tailwind);
    const greyLightColor = getColorValue('text-lighter-gray', tailwind);
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);

    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [formData, setFormData] = useState<LoginAuth>({
        email: '',
        password: '',
    });

    const [placeholder, setPlaceholder] = useState({
        email: 'Enter email',
        password: 'Enter password',
    });

    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    useEffect(() => {
        if (isAuthenticated && user) {
            console.log('✅ User is authenticated, should navigate to home');
        }
    }, [isAuthenticated, user]);

    const updateFormData = useCallback((field: keyof LoginAuth, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (validationErrors[field]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    }, [validationErrors]);

    const handleFocus = useCallback((field: keyof LoginAuth) => {
        setPlaceholder(prev => ({ ...prev, [field]: '' }));
    }, []);

    const handleBlur = useCallback(
        (field: keyof LoginAuth, defaultValue: string) => {
            setPlaceholder(prev => ({ ...prev, [field]: defaultValue }));
            validateField(field);
        },
        [formData],
    );

    const validateField = useCallback(
        (field: keyof LoginAuth): boolean => {
            let error: string | null = null;
            const value = formData[field] || '';

            switch (field) {
                case 'email':
                    error =
                        validationHelpers.isRequired(value, 'Email') || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Please enter a valid email address' : null;
                    break;
                case 'password':
                    error = validationHelpers.isRequired(value, 'Password')
                    break;
            }

            if (error) {
                setValidationErrors(prev => ({ ...prev, [field]: error as string }));
                return false;
            } else {
                setValidationErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[field];
                    return newErrors;
                });
            }
            return true;
        },
        [formData],
    );

    const validateForm = useCallback((): boolean => {
        const emailValid = validateField('email');
        const passwordValid = validateField('password');
        return emailValid && passwordValid;
    }, [validateField]);


    const handleSubmit = useCallback(async () => {

        if (!validateForm()) {
            console.log('Please fix the errors before submitting.');
            return;
        }

        setIsloading(true);

        try {
            console.log('Form Data:', formData);

            const result = await dispatch(
                loginWithEmail({
                    email: formData.email!,
                    password: formData.password!,
                })
            ).unwrap();

            Alert.alert(
                'Login Successful',
                `Welcome back, ${result.user.name}!`,
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.reset({
                                index: 0,
                                routes: [
                                    {
                                        name: SCREENS.Home_stack,
                                        state: { routes: [{ name: SCREENS.Home_page }] },
                                    },
                                ],
                            });
                        }
                    }
                ]
            );

        } catch (error: any) {
            console.log('Error submitting login:', error);

            Alert.alert(
                'Login Error',
                error?.message || 'An unexpected error occurred',
                [{ text: 'OK' }]
            );

            setIsloading(false)
        } finally {
            setIsloading(false)
        }
    }, [formData, validateForm, setIsloading, dispatch]);

    return (
        <SafeAreaView style={[tailwind('flex-1'), {}]}>
            
            <ContainerWrapper style={tailwind('ml-5 mr-5')}>
                <LottieWrapper lottie={require('../../assets/lottie/login.json')} size={200} />
            </ContainerWrapper>

            <ScrollView showsVerticalScrollIndicator={false}
                contentContainerStyle={[tailwind('mt-5'), {}]}
                keyboardShouldPersistTaps="handled">

                <ContainerWrapper style={tailwind('ml-5 mr-5')}>
                    <TextInputCustomComponent
                        isValid={!validationErrors.email}
                        label="Email"
                        height={50}
                        placeholder={placeholder.email}
                        colorLabel={blackColor}
                        placeholderTextColor={greyLightColor}
                        onEndEditing={() => validateField('email')}
                        value={formData?.email}
                        onChangeText={text => updateFormData('email', text)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={[tailwind('mb-2 bg-white-pure'), {}]}
                        onFocus={() => handleFocus('email')}
                        onBlur={() => handleBlur('email', 'Enter email')}
                    />
                    {validationErrors.email && <ErrorTextWrapper errorMessage={validationErrors.email} hasError isValid />}

                    <TextInputCustomComponent
                        isValid={!validationErrors.password}
                        label="Password"
                        height={50}
                        placeholder={placeholder.password}
                        colorLabel={blackColor}
                        placeholderTextColor={greyLightColor}
                        onEndEditing={() => validateField('password')}
                        value={formData?.password}
                        onChangeText={text => updateFormData('password', text)}
                        isPasswordIcon={true}
                        style={[tailwind('mb-2 bg-white-pure'), {}]}
                        onFocus={() => handleFocus('password')}
                        onBlur={() => handleBlur('password', 'Enter password')}
                    />
                    {validationErrors.password && <ErrorTextWrapper errorMessage={validationErrors.password} hasError isValid />}

                    <ResponsiveUi.Button
                        regular
                        gradient={true}
                        fontSize={16}
                        title="Login"
                        colors={['#005ab3', '#0060DF']}
                        style={[tailwind('w-full mt-5 mb-3')]}
                        action={() => { handleSubmit() }}
                    />

                    <AuthRedirectText
                        primaryText={LabelsText.dont_have_an_account}
                        secondaryText={LabelsText.register}
                        onPress={() => navigation.navigate(SCREENS.Register_page)}
                    />
                </ContainerWrapper>
            </ScrollView>
        </SafeAreaView>
    );
};

export default IndexLoginEmailContainer;
