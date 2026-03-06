import math
import array
import wave

def generate_om_chant(filename, duration=7.0):
    sample_rate = 44100
    num_samples = int(duration * sample_rate)
    amplitude = 12000
    om_freq = 136.1 # 'Om' base frequency (C#)

    # Pre-calculate audio data array
    data = array.array('h')
    
    for i in range(num_samples):
        t = float(i) / sample_rate
        
        # Long, sweeping envelope: 1.5s attack, 3.5s sustain, 2s release
        if t < 1.5:
            env = t / 1.5
        elif t > duration - 2.0:
            env = max(0.0, (duration - t) / 2.0)
        else:
            env = 1.0
            
        # The 'A' (ahh) sound - mostly fundamental and 2nd harmonic
        # The 'U' (oo) sound - stronger 2nd and 3rd harmonics
        # The 'M' (mm) sound - closed mouth, more fundamental and rich nasality
        
        if t < 2.0:
            # 'A' sound
            h1, h2, h3, h4 = 1.0, 0.4, 0.1, 0.05
        elif t < 4.0:
            # Transition to 'U'
            progress = (t - 2.0) / 2.0
            h1 = 1.0 - (progress * 0.2)
            h2 = 0.4 + (progress * 0.4)
            h3 = 0.1 + (progress * 0.3)
            h4 = 0.05 + (progress * 0.2)
        else:
            # Transition to 'M' (nasal, resonant)
            progress = min(1.0, (t - 4.0) / 1.5)
            h1 = 0.8 + (progress * 0.2)
            h2 = 0.8 - (progress * 0.6)
            h3 = 0.4 - (progress * 0.2)
            h4 = 0.25 - (progress * 0.1)
            
        # Add slow vibrato
        vibrato_rate = 3.5 + min(1.5, t * 0.2)  # speeds up slightly
        vibrato_depth = 0.01
        vibrato = math.sin(2.0 * math.pi * vibrato_rate * t) * vibrato_depth
        
        freq = om_freq * (1.0 + vibrato)
        
        # Calculate harmonics
        sig = h1 * math.sin(2.0 * math.pi * freq * t)
        sig += h2 * math.sin(2.0 * math.pi * freq * 2.0 * t)
        sig += h3 * math.sin(2.0 * math.pi * freq * 3.0 * t)
        sig += h4 * math.sin(2.0 * math.pi * freq * 4.0 * t)
        
        # Normalize sum of harmonics to prevent distortion
        sig_norm = sig / (h1 + h2 + h3 + h4)
        
        value = int(sig_norm * env * amplitude)
        data.append(value)
        
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1) # mono
        wav_file.setsampwidth(2) # 16 bit
        wav_file.setframerate(sample_rate)
        wav_file.writeframes(data.tobytes())

generate_om_chant('om_chant.wav')
print("Generated high-quality om_chant.wav")
