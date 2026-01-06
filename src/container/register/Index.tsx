import React, { useCallback, useState } from 'react';
import { Alert, SafeAreaView, ScrollView } from 'react-native';
import { ResponsiveUi } from 'src/components/responsive-ui/responsive-ui';
import { AuthRedirectText } from 'src/components/wrappers-component/Authredirect-text';
import TextInputCustomComponent from 'src/components/wrappers-component/ContainerTextInput';
import ContainerWrapper from 'src/components/wrappers-component/ContainerWrapper';
import ErrorTextWrapper from 'src/components/wrappers-component/ErrorTextWrapper';
import LottieWrapper from 'src/components/wrappers-component/LottieWrapper';
import { LabelsText } from 'src/enums/labels-text/labels';
import { SCREENS } from 'src/enums/screens/screens';
import { clearError, registerUser } from 'src/global/auth/auth-slice';
import { useAppDispatch, useAppSelector } from 'src/global/store/hooks';
import { REGEXVALIDATORS } from 'src/models/validators';
import { useloading } from 'src/services/load/loading-services';
import { FormDataAuth, ValidationErrors } from 'src/typings/input-typings';
import { RootStackScreenProps } from 'src/typings/navigation';
import { getColorValue, validationHelpers } from 'src/utils/utils';
import { useTailwind } from 'tailwind-rn';

const IndexRegisterEmailContainer = ({ route, navigation }: RootStackScreenProps<SCREENS.Register_page>) => {

    const tailwind = useTailwind();
    const { setIsloading } = useloading();
    const dispatch = useAppDispatch();
    const { isLoading, error: authError } = useAppSelector(state => state.auth);
    const blackColor = getColorValue('text-black-pure', tailwind);
    const greyLightColor = getColorValue('text-lighter-gray', tailwind);
    const MIN_NAME_LENGTH = 2;

    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [formData, setFormData] = useState<FormDataAuth>({
        email: '',
        password: '',
        name: ''
    });

    const [placeholder, setPlaceholder] = useState({
        email: 'Enter email',
        password: 'Enter password',
        name: 'Enter name'
    });

    React.useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    React.useEffect(() => {
        if (authError) {
            Alert.alert('Registration Error', authError.message);
        }
    }, [authError]);

    const updateFormData = useCallback((field: keyof FormDataAuth, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (validationErrors[field]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
        if (authError) {
            dispatch(clearError());
        }
    }, [validationErrors, authError, dispatch]);

    const handleFocus = useCallback((field: keyof FormDataAuth) => {
        setPlaceholder(prev => ({ ...prev, [field]: '' }));
    }, []);

    const handleBlur = useCallback(
        (field: keyof FormDataAuth, defaultValue: string) => {
            setPlaceholder(prev => ({ ...prev, [field]: defaultValue }));
            validateField(field);
        },
        [formData],
    );

    const validateField = useCallback(
        (field: keyof FormDataAuth): boolean => {
            let error: string | null = null;
            const value = formData[field] || '';

            switch (field) {
                case 'name':
                    if (!value || value.trim() === '') {
                        error = 'Name is required';
                        break;
                    }

                    if (value.trim().length < MIN_NAME_LENGTH) {
                        error = `Name must be at least ${MIN_NAME_LENGTH} characters`;
                        break;
                    }

                    if (!REGEXVALIDATORS.name.test(value.trim())) {
                        error = 'Name can only contain letters, spaces, apostrophes, dots, and hyphens';
                        break;
                    }
                    break;
                case 'email':
                    error =
                        validationHelpers.isRequired(value, 'Email') || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Please enter a valid email address' : null;
                    break;
                case 'password':
                    error = validationHelpers.isRequired(value, 'Password') || validationHelpers.minLength(value, 6, 'Password')
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
        const nameValid = validateField('name');
        return emailValid && passwordValid && nameValid;
    }, [validateField]);

    const handleSubmit = useCallback(async () => {

        if (!validateForm()) {
            console.log('Please fix the errors before submitting.');
            return;
        }

        setIsloading(true)

        try {
            console.log('Form Data:', formData);
            console.log('📝 Submitting registration:', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            const resultAction = await dispatch(
                registerUser({
                    email: formData.email,
                    name: formData.name,
                    password: formData.password,
                })
            );

            if (registerUser.fulfilled.match(resultAction)) {
                console.log('✅ Registration successful!');

                Alert.alert(
                    'Success',
                    'Account created successfully!',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                // navigation.goBack();
                            }
                        }
                    ]
                );
            } else {
                console.log('Registration failed:', resultAction.payload);
            }
        } catch (error: any) {
            console.log('Error submitting register:', error);
            Alert.alert(
                'Register Error',
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
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[tailwind('mt-5'), {}]}>

            <LottieWrapper lottie={require('../../assets/lottie/register.json')} size={200} />

                <ContainerWrapper style={tailwind('ml-5 mr-5')}>
                    <TextInputCustomComponent
                        isValid={!validationErrors.name}
                        label="Name"
                        height={50}
                        placeholder={placeholder.name}
                        colorLabel={blackColor}
                        placeholderTextColor={greyLightColor}
                        onEndEditing={() => validateField('name')}
                        value={formData?.name}
                        onChangeText={text => updateFormData('name', text)}
                        autoCapitalize="none"
                        style={[tailwind('mb-2 bg-white-pure'), {}]}
                        onFocus={() => handleFocus('name')}
                        onBlur={() => handleBlur('name', 'Enter name')}
                    />
                    {validationErrors.name && <ErrorTextWrapper errorMessage={validationErrors.name} hasError isValid />}

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
                        title="Register"
                        colors={['#005ab3', '#0060DF']}
                        style={[tailwind('w-full mt-5 mb-3')]}
                        action={() => { handleSubmit() }}
                    />

                    <AuthRedirectText
                        primaryText={LabelsText.already_have_an_account}
                        secondaryText={LabelsText.login}
                        onPress={() => navigation.navigate(SCREENS.Login_page)}
                    />
                </ContainerWrapper>
            </ScrollView>
        </SafeAreaView>
    );
};

export default IndexRegisterEmailContainer;
