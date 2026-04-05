'use client';

import { register, setToken } from '@/lib/api';
import type { ApiError } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) {
      setErrors({ general: 'You must agree to the terms & conditions.' });
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const res = await register(form);
      setToken(res.token);
      router.push('/feed');
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr.errors) {
        const flat: Record<string, string> = {};
        Object.entries(apiErr.errors).forEach(([k, v]) => {
          flat[k] = v[0];
        });
        setErrors(flat);
      } else {
        setErrors({ general: apiErr.message ?? 'Registration failed.' });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="_social_registration_wrapper _layout_main_wrapper">
      <div className="_shape_one">
        <img src="/assets/images/shape1.svg" alt="" className="_shape_img" />
        <img src="/assets/images/dark_shape.svg" alt="" className="_dark_shape" />
      </div>
      <div className="_shape_two">
        <img src="/assets/images/shape2.svg" alt="" className="_shape_img" />
        <img src="/assets/images/dark_shape1.svg" alt="" className="_dark_shape _dark_shape_opacity" />
      </div>
      <div className="_shape_three">
        <img src="/assets/images/shape3.svg" alt="" className="_shape_img" />
        <img src="/assets/images/dark_shape2.svg" alt="" className="_dark_shape _dark_shape_opacity" />
      </div>

      <div className="_social_registration_wrap">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className="_social_registration_right">
                <div className="_social_registration_right_image">
                  <img src="/assets/images/registration.png" alt="Register" />
                </div>
              </div>
            </div>

            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <div className="_social_registration_content">
                <div className="_social_registration_right_logo _mar_b28">
                  <img src="/assets/images/logo.svg" alt="BuddyScript" className="_right_logo" />
                </div>
                <p className="_social_registration_content_para _mar_b8">Get Started Now</p>
                <h4 className="_social_registration_content_title _titl4 _mar_b50">Registration</h4>

                <button type="button" className="_social_registration_content_btn _mar_b40">
                  <img src="/assets/images/google.svg" alt="Google" className="_google_img" />
                  <span>Register with google</span>
                </button>

                <div className="_social_registration_content_bottom_txt _mar_b40">
                  <span>Or</span>
                </div>

                {errors.general && (
                  <div className="alert alert-danger py-2 mb-3">{errors.general}</div>
                )}

                <form className="_social_registration_form" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-xl-6">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">First Name</label>
                        <input
                          type="text"
                          name="first_name"
                          className={`form-control _social_registration_input${errors.first_name ? ' is-invalid' : ''}`}
                          value={form.first_name}
                          onChange={handleChange}
                          required
                        />
                        {errors.first_name && <div className="invalid-feedback">{errors.first_name}</div>}
                      </div>
                    </div>
                    <div className="col-xl-6">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">Last Name</label>
                        <input
                          type="text"
                          name="last_name"
                          className={`form-control _social_registration_input${errors.last_name ? ' is-invalid' : ''}`}
                          value={form.last_name}
                          onChange={handleChange}
                          required
                        />
                        {errors.last_name && <div className="invalid-feedback">{errors.last_name}</div>}
                      </div>
                    </div>
                    <div className="col-xl-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">Email</label>
                        <input
                          type="email"
                          name="email"
                          className={`form-control _social_registration_input${errors.email ? ' is-invalid' : ''}`}
                          value={form.email}
                          onChange={handleChange}
                          required
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                      </div>
                    </div>
                    <div className="col-xl-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">Password</label>
                        <input
                          type="password"
                          name="password"
                          className={`form-control _social_registration_input${errors.password ? ' is-invalid' : ''}`}
                          value={form.password}
                          onChange={handleChange}
                          required
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                      </div>
                    </div>
                    <div className="col-xl-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">Repeat Password</label>
                        <input
                          type="password"
                          name="password_confirmation"
                          className={`form-control _social_registration_input${errors.password_confirmation ? ' is-invalid' : ''}`}
                          value={form.password_confirmation}
                          onChange={handleChange}
                          required
                        />
                        {errors.password_confirmation && (
                          <div className="invalid-feedback">{errors.password_confirmation}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-12">
                      <div className="form-check _social_registration_form_check">
                        <input
                          className="form-check-input _social_registration_form_check_input"
                          type="checkbox"
                          id="agreeTerms"
                          checked={agreed}
                          onChange={(e) => setAgreed(e.target.checked)}
                        />
                        <label
                          className="form-check-label _social_registration_form_check_label"
                          htmlFor="agreeTerms"
                        >
                          I agree to terms &amp; conditions
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-12">
                      <div className="_social_registration_form_btn _mar_t40 _mar_b60">
                        <button
                          type="submit"
                          className="_social_registration_form_btn_link _btn1"
                          disabled={loading}
                        >
                          {loading ? 'Creating account...' : 'Login now'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                <div className="row">
                  <div className="col-xl-12">
                    <div className="_social_registration_bottom_txt">
                      <p className="_social_registration_bottom_txt_para">
                        Already have an account?{' '}
                        <Link href="/login">Login</Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
