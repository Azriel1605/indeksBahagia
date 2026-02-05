"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import LikertQuestion from "./ui/likert-scale"
import { Button } from "./ui/button"
import { dataAPI } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SurveyProps {
    bahagia: number | undefined;
    semangat: number | undefined;
    fokus: number | undefined;
    bertenaga: number | undefined;
    stress: number | undefined;
    dukungan_teman: number | undefined;
    dukungan_guru: number | undefined;
    aman: number | undefined;
    rasakan: string | undefined;
}

export default function SurveyHarian(){

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [setuju, setSetuju] = useState<boolean | undefined>(undefined);

    const [form, setForm] = useState<SurveyProps>({
        bahagia: undefined,
        semangat: undefined,
        fokus: undefined,
        bertenaga: undefined,
        stress: undefined,
        dukungan_teman: undefined,
        dukungan_guru: undefined,
        aman: undefined,
        rasakan: "",
    });

    const handleChangeHarian = (field: keyof SurveyProps, value: number) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        // ❗ Validasi wajib setuju
        if (setuju !== true){
            window.scrollTo({ top: 0, behavior: "smooth" });
            setError("Anda harus menyetujui pernyataan kesediaan sebelum mengisi survei.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await dataAPI.submitSurveyHarian(form);
            const resData = await response.json();

            if (response.ok) {
                setMessage(resData.message || "Data berhasil disimpan.");
                window.location.reload();
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setError(resData.message || "Terjadi kesalahan saat menyimpan data.");
            }

        } catch (error) {
            console.error("Error submitting survey:", error);
            setError("Terjadi kesalahan saat menyimpan data.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
    <form onSubmit={handleSubmit}>
        {message && (
            <Alert>
                <AlertDescription>{message}</AlertDescription>
            </Alert>
        )}

        {error && (
            <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        <Card>
        <CardHeader>
            <CardTitle>Pernyataan Kesediaan</CardTitle>
            <CardDescription>Anda harus menyetujui untuk melanjutkan survei</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
            
            {/* 🔵 Bagian Kesediaan */}
            <div className="p-4 border rounded-xl bg-blue-50">
                <p className="font-medium mb-3 text-blue-900">
                    Saya bersedia mengisi dengan jujur. <span className="text-red-500">*</span>
                </p>

                <button
                    type="button"
                    onClick={() => setSetuju(true)}
                    className={`
                        w-full py-3 rounded-xl font-semibold transition-all
                        flex items-center justify-center space-x-2
                        ${setuju
                            ? "bg-green-600 hover:bg-green-700 text-white shadow-md scale-[1.01]"
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                        }
                    `}
                >
                    {setuju && (
                        <span className="text-xl">✔</span>
                    )}
                    <span>
                        {setuju ? "Sudah Menyetujui" : "Ya, Saya Setuju"}
                    </span>
                </button>
            </div>


            {/* ---------------------------------------------------------------- */}
            {/* Bagian Pertanyaan Skala Likert */}
            {/* ---------------------------------------------------------------- */}

            {/* Bahagia */}
            <LikertQuestion
                number={1}
                question="Saya merasa cukup bahagia hari ini"
                value={form.bahagia}
                onChange={(value) => handleChangeHarian("bahagia", value)}
                required
            />

            {/* Semangat */}
            <LikertQuestion
                number={2}
                question="Semangat saya untuk belajar hari ini tinggi"
                value={form.semangat}
                onChange={(value) => handleChangeHarian("semangat", value)}
                required
            />

            {/* Fokus */}
            <LikertQuestion
                number={3}
                question="Saya bisa fokus saat pelajaran hari ini"
                value={form.fokus}
                onChange={(value) => handleChangeHarian("fokus", value)}
                required
            />

            {/* Bertenaga */}
            <LikertQuestion
                number={4}
                question="Saya merasa bertenaga/berenergi hari ini"
                value={form.bertenaga}
                onChange={(value) => handleChangeHarian("bertenaga", value)}
                required
            />

            {/* Stress */}
            <LikertQuestion
                number={5}
                question="Saya merasa stres/tertekan hari ini"
                value={form.stress}
                onChange={(value) => handleChangeHarian("stress", value)}
                required
            />

            {/* Dukungan Teman */}
            <LikertQuestion
                number={6}
                question="Saya merasa didukung oleh teman hari ini"
                value={form.dukungan_teman}
                onChange={(value) => handleChangeHarian("dukungan_teman", value)}
                required
            />

            {/* Dukungan Guru */}
            <LikertQuestion
                number={7}
                question="Saya merasa didukung oleh guru hari ini"
                value={form.dukungan_guru}
                onChange={(value) => handleChangeHarian("dukungan_guru", value)}
                required
            />

            {/* Aman */}
            <LikertQuestion
                number={8}
                question="Saya merasa aman di lingkungan sekolah hari ini"
                value={form.aman}
                onChange={(value) => handleChangeHarian("aman", value)}
                required
            />

            {/* Pertanyaan terbuka */}
            <div className="w-full max-w-3xl mt-6">
                <label className="block text-blue-800 font-medium mb-2">
                    Ceritakan perasaan Anda hari ini:
                </label>
                <textarea
                    value={form.rasakan}
                    onChange={(e) =>
                        setForm((prev) => ({ ...prev, rasakan: e.target.value }))
                    }
                    className="w-full p-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Tuliskan jawaban Anda..."
                    rows={3}
                />
            </div>

            <div className="flex justify-end space-x-4">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Menyimpan..." : "Simpan Data"}
                </Button>
            </div>

        </CardContent>
        </Card>
    </form>
    )
}
